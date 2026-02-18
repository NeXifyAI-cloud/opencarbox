import crypto from 'node:crypto';

import { NextResponse } from 'next/server';

import { deepseekChatCompletion } from '@/lib/ai/deepseekClient';

type ControllerAction = 'run_autofix' | 'run_conflict_resolver' | 'run_auto_improve' | 'open_triage_issue' | 'ignore';

type ControllerDecision = {
  action: ControllerAction;
  reason: string;
};

const ACTION_TO_DISPATCH_EVENT: Record<Exclude<ControllerAction, 'ignore'>, string> = {
  run_autofix: 'codex.run_autofix',
  run_conflict_resolver: 'codex.run_conflict_resolver',
  run_auto_improve: 'codex.run_auto_improve',
  open_triage_issue: 'codex.open_triage_issue',
};

function timingSafeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function verifySignature(rawBody: string, signatureHeader: string | null): boolean {
  const webhookSecret = process.env.CODEX_WEBHOOK_SECRET;

  if (!webhookSecret || !signatureHeader) {
    return false;
  }

  const expected = `sha256=${crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex')}`;
  return timingSafeEqual(expected, signatureHeader);
}

function summarizePayload(payload: unknown): string {
  const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return serialized.slice(0, 7000);
}

function parseAiDecision(raw: string): ControllerDecision | null {
  try {
    const parsed = JSON.parse(raw) as ControllerDecision;
    if (!parsed || typeof parsed !== 'object') return null;
    if (!parsed.reason || typeof parsed.reason !== 'string') return null;
    if (!['run_autofix', 'run_conflict_resolver', 'run_auto_improve', 'open_triage_issue', 'ignore'].includes(parsed.action)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

async function decideAction(eventType: string, payload: unknown): Promise<ControllerDecision> {
  const fallback: ControllerDecision = {
    action: 'open_triage_issue',
    reason: 'Fallback routing decision due to unavailable AI output.',
  };

  const response = (await deepseekChatCompletion({
    model: 'deepseek-chat',
    temperature: 0,
    response_format: {
      type: 'json_object',
    },
    messages: [
      {
        role: 'system',
        content:
          'You are a strict webhook router for CI automation. Decide one action from: run_autofix, run_conflict_resolver, run_auto_improve, open_triage_issue, ignore. Return JSON only with keys action and reason. Prefer ignore for successful events.',
      },
      {
        role: 'user',
        content: `event_type=${eventType}\n\npayload_summary=${summarizePayload(payload)}`,
      },
    ],
  })) as { choices?: Array<{ message?: { content?: string } }> };

  const content = response.choices?.[0]?.message?.content?.trim();
  if (!content) {
    return fallback;
  }

  return parseAiDecision(content) ?? fallback;
}

async function dispatchGitHubEvent(eventType: string, payload: Record<string, unknown>) {
  const githubToken = process.env.GH_PAT || process.env.GITHUB_TOKEN;
  const targetRepository = process.env.GITHUB_REPOSITORY;

  if (!githubToken || !targetRepository) {
    throw new Error('GitHub dispatch is not configured (missing GH_PAT/GITHUB_TOKEN or GITHUB_REPOSITORY).');
  }

  const [owner, repo] = targetRepository.split('/');
  if (!owner || !repo) {
    throw new Error('GITHUB_REPOSITORY must follow owner/repo format.');
  }

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/dispatches`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      event_type: eventType,
      client_payload: payload,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`GitHub dispatch failed with ${response.status}: ${body.slice(0, 300)}`);
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signatureHeader = request.headers.get('x-codex-signature-256');

  if (!verifySignature(rawBody, signatureHeader)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid webhook signature.',
        },
      },
      { status: 401 }
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVALID_JSON',
          message: 'Webhook payload must be valid JSON.',
        },
      },
      { status: 400 }
    );
  }

  const eventType = request.headers.get('x-codex-event') || 'unknown';

  try {
    const decision = await decideAction(eventType, payload);

    if (decision.action !== 'ignore') {
      await dispatchGitHubEvent(ACTION_TO_DISPATCH_EVENT[decision.action], {
        source: 'codex-controller-webhook',
        decision,
        eventType,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        provider: 'deepseek',
        decision,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ROUTING_FAILED',
          message: error instanceof Error ? error.message : 'Unknown routing error.',
        },
      },
      { status: 502 }
    );
  }
}
