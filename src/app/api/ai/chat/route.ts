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

function isAiChatEnabled() {
  const flag = process.env.FEATURE_AI_CHAT;
  return flag === undefined || flag === 'true';
}

export async function POST(request: Request) {
  if (!isAiChatEnabled()) {
    return NextResponse.json(
      {
        error: 'AI chat is disabled by FEATURE_AI_CHAT flag.',
      },
      { status: 503 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation failed.',
        details: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  try {
    const response = await deepseekChatCompletion(parsed.data);

    return NextResponse.json({
      provider: 'deepseek',
      ...response,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown AI provider error.';

    return NextResponse.json(
      {
        error: 'AI provider request failed.',
        message,
      },
      { status: 502 }
    );
  }
}
