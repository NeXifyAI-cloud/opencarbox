import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getProvider } from '@/lib/ai/providers';

const modelRequestSchema = z.object({
  provider: z.enum(['mock', 'deepseek', 'openai_compat']).default('mock'),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID();

  try {
    const parsed = modelRequestSchema.parse(await request.json());
    const provider = getProvider(parsed.provider);
    const models = await provider.listModels();

    return NextResponse.json({ requestId, provider: parsed.provider, models });
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
