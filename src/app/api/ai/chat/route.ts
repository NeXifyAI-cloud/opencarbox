import { NextResponse } from 'next/server';

import { aiChatRequestSchema } from '@/lib/api/contracts/ai-chat';
import {
  ApiError,
  FeatureDisabledError,
  InvalidJsonError,
  RateLimitExceededError,
  UpstreamAiError,
  ValidationError,
} from '@/lib/api/errors';
import { consumeRateLimit } from '@/lib/api/rate-limit';
import { deepseekChatCompletion } from '@/lib/ai/deepseekClient';

const RATE_LIMIT_WINDOW_MS = 60_000;

function getRateLimitMaxRequests() {
  const parsed = Number(process.env.AI_CHAT_RATE_LIMIT_PER_MINUTE ?? 20);

  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 20;
}

function isAiChatEnabled() {
  const flag = process.env.FEATURE_AI_CHAT;
  return flag === undefined || flag === 'true';
}

function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return request.headers.get('x-real-ip') ?? 'unknown';
}

function toErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        ...(error.details ? { details: error.details } : {}),
      },
      {
        status: error.statusCode,
        headers:
          error instanceof RateLimitExceededError
            ? {
                'Retry-After': String(
                  (error.details as { retryAfterSeconds: number }).retryAfterSeconds
                ),
              }
            : undefined,
      }
    );
  }

  const message = error instanceof Error ? error.message : 'Unknown AI provider error.';

  return NextResponse.json(
    {
      error: 'AI provider request failed.',
      code: 'AI_UPSTREAM_ERROR',
      details: message,
    },
    { status: 502 }
  );
}

export async function POST(request: Request) {
  try {
    if (!isAiChatEnabled()) {
      throw new FeatureDisabledError();
    }

    const clientId = getClientIdentifier(request);
    const rateLimit = consumeRateLimit(
      clientId,
      getRateLimitMaxRequests(),
      RATE_LIMIT_WINDOW_MS
    );

    if (!rateLimit.allowed) {
      throw new RateLimitExceededError(rateLimit.retryAfterSeconds);
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      throw new InvalidJsonError();
    }

    const parsed = aiChatRequestSchema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError(parsed.error.flatten());
    }

    try {
      const response = await deepseekChatCompletion(parsed.data);

      return NextResponse.json({
        provider: 'deepseek',
        ...response,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown AI provider error.';
      throw new UpstreamAiError(message);
    }
  } catch (error) {
    return toErrorResponse(error);
  }
}
