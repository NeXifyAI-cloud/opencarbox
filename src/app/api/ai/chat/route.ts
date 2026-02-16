import { randomUUID } from 'crypto';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { requireAuth } from '@/lib/auth/require-auth';
import { requestChatCompletion } from '@/lib/ai/provider';
import { log } from '@/lib/observability/logger';
import { writeAiTelemetry } from '@/lib/observability/ai-telemetry';
import { checkRateLimit } from '@/lib/server/rate-limit';

const chatSchema = z.object({
  provider: z.enum(['deepseek', 'openai_compat']),
  model: z.string().min(1).max(128).optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string().min(1).max(4_000),
      }),
    )
    .min(1)
    .max(30),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestId = randomUUID();
  const auth = await requireAuth(request.headers.get('authorization'));

  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const rate = checkRateLimit(`${auth.userId}:${clientIp}`);
  if (!rate.ok) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        resetAt: new Date(rate.resetAt).toISOString(),
      },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = chatSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  }

  const startedAt = Date.now();

  try {
    const result = await requestChatCompletion(parsed.data);
    const latencyMs = Date.now() - startedAt;

    await writeAiTelemetry({
      userId: auth.userId,
      provider: parsed.data.provider,
      model: result.model,
      status: 'ok',
      latencyMs,
    });

    log('info', {
      event: 'ai.chat.success',
      requestId,
      userId: auth.userId,
      provider: parsed.data.provider,
      latencyMs,
      status: 200,
    });

    return NextResponse.json(
      {
        id: requestId,
        provider: parsed.data.provider,
        model: result.model,
        message: result.text,
      },
      { status: 200 },
    );
  } catch (error) {
    const latencyMs = Date.now() - startedAt;
    const reason = error instanceof Error ? error.message : 'Unknown error';

    await writeAiTelemetry({
      userId: auth.userId,
      provider: parsed.data.provider,
      model: parsed.data.model ?? 'unknown',
      status: 'error',
      latencyMs,
      errorCode: reason,
    });

    log('error', {
      event: 'ai.chat.failed',
      requestId,
      userId: auth.userId,
      provider: parsed.data.provider,
      latencyMs,
      status: 502,
      reason,
    });

    return NextResponse.json({ error: 'Upstream AI provider failure' }, { status: 502 });
  }
}
