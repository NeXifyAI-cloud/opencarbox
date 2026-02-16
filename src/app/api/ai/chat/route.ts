import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getProvider } from '@/lib/ai/providers';

const chatRequestSchema = z.object({
  provider: z.enum(['mock', 'deepseek', 'openai_compat']).default('mock'),
  model: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID();

  try {
    const parsed = chatRequestSchema.parse(await request.json());
    const provider = getProvider(parsed.provider);
    const response = await provider.chatCompletion(
      [{ role: 'user', content: parsed.message }],
      { model: parsed.model },
    );

    return NextResponse.json({ requestId, provider: parsed.provider, response });
  } catch (error) {
    return NextResponse.json(
      {
        requestId,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 },
    );
  }
}
