import { NextResponse } from 'next/server';
import { z } from 'zod';

import { deepseekChatCompletion } from '@/lib/ai/deepseekClient';

const chatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string().min(1).max(8_000),
});

const chatRequestSchema = z.object({
  model: z.string().min(1).default('deepseek-chat'),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().positive().max(4_096).optional(),
  messages: z.array(chatMessageSchema).min(1).max(50),
});

type ApiErrorCode =
  | 'INVALID_JSON'
  | 'VALIDATION_ERROR'
  | 'FEATURE_DISABLED'
  | 'RATE_LIMITED'
  | 'UPSTREAM_TIMEOUT'
  | 'UPSTREAM_ERROR'
  | 'INTERNAL_ERROR';

const errorStatusByCode: Record<ApiErrorCode, number> = {
  INVALID_JSON: 400,
  VALIDATION_ERROR: 422,
  FEATURE_DISABLED: 503,
  RATE_LIMITED: 429,
  UPSTREAM_TIMEOUT: 504,
  UPSTREAM_ERROR: 502,
  INTERNAL_ERROR: 500,
};

const RATE_LIMIT_WINDOW_MS = Number(process.env.AI_CHAT_RATE_LIMIT_WINDOW_MS ?? 60_000);
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.AI_CHAT_RATE_LIMIT_MAX_REQUESTS ?? 10);
const CHAT_TIMEOUT_MS = Number(process.env.AI_CHAT_TIMEOUT_MS ?? 12_000);
const CHAT_RETRY_COUNT = Number(process.env.AI_CHAT_RETRY_COUNT ?? 2);

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function isAiChatEnabled() {
  const flag = process.env.FEATURE_AI_CHAT;
  return flag === undefined || flag === 'true';
}

function errorResponse(
  code: ApiErrorCode,
  message: string,
  details?: Record<string, unknown>
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status: errorStatusByCode[code] }
  );
}

function getClientKey(request: Request): string {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0]?.trim() ?? 'unknown';
  }

  return request.headers.get('x-real-ip') ?? 'unknown';
}

function enforceRateLimit(request: Request) {
  const clientKey = getClientKey(request);
  const now = Date.now();
  const current = rateLimitStore.get(clientKey);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(clientKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    throw {
      code: 'RATE_LIMITED' as const,
      message: 'Rate limit exceeded.',
      details: {
        limit: RATE_LIMIT_MAX_REQUESTS,
        windowMs: RATE_LIMIT_WINDOW_MS,
        retryAfterMs: Math.max(current.resetAt - now, 0),
      },
    };
  }

  current.count += 1;
  rateLimitStore.set(clientKey, current);
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Request timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error: unknown) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

function parseUpstreamStatus(error: unknown): number | null {
  if (!(error instanceof Error)) {
    return null;
  }

  const statusMatch = error.message.match(/DeepSeek error\s+(\d{3})/i);
  return statusMatch ? Number(statusMatch[1]) : null;
}

async function callWithRetry(payload: z.infer<typeof chatRequestSchema>) {
  const maxAttempts = CHAT_RETRY_COUNT + 1;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await withTimeout(deepseekChatCompletion(payload), CHAT_TIMEOUT_MS);
      return { response, attempt, maxAttempts };
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
    }
  }

  throw lastError;
}

export async function POST(request: Request) {
  if (!isAiChatEnabled()) {
    return errorResponse('FEATURE_DISABLED', 'AI chat is disabled by FEATURE_AI_CHAT flag.');
  }

  try {
    enforceRateLimit(request);
  } catch (rateLimitError) {
    if (rateLimitError && typeof rateLimitError === 'object' && 'code' in rateLimitError) {
      const parsed = rateLimitError as { code: ApiErrorCode; message: string; details?: Record<string, unknown> };
      return errorResponse(parsed.code, parsed.message, parsed.details);
    }
    return errorResponse('INTERNAL_ERROR', 'Unexpected error in rate limiting.');
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse('INVALID_JSON', 'Invalid JSON body.');
  }

  const parsed = chatRequestSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse('VALIDATION_ERROR', 'Validation failed.', parsed.error.flatten());
  }

  try {
    const { response, attempt, maxAttempts } = await callWithRetry(parsed.data);

    return NextResponse.json({
      success: true,
      data: {
        provider: 'deepseek',
        ...response,
      },
      meta: {
        attempt,
        maxAttempts,
      },
    });
  } catch (error) {
    const upstreamStatus = parseUpstreamStatus(error);

    if (error instanceof Error && error.message.includes('timed out')) {
      return errorResponse('UPSTREAM_TIMEOUT', 'AI provider request timed out.', {
        timeoutMs: CHAT_TIMEOUT_MS,
        retries: CHAT_RETRY_COUNT,
      });
    }

    if (upstreamStatus && upstreamStatus >= 400 && upstreamStatus <= 599) {
      return errorResponse('UPSTREAM_ERROR', 'AI provider request failed.', {
        upstreamStatus,
        message: error instanceof Error ? error.message : 'Unknown AI provider error.',
      });
    }

    return errorResponse('INTERNAL_ERROR', 'Unexpected AI chat failure.', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
