import { z } from 'zod';

export const AiEnvSchema = z.object({
  AI_PROVIDER: z.literal('deepseek'),
  DEEPSEEK_API_KEY: z.string().min(1),
  DEEPSEEK_BASE_URL: z.string().url().optional(),
  NSCALE_API_KEY: z.string().min(1),
  NSCALE_HEADER_NAME: z.string().min(1).default('X-NSCALE-API-KEY'),
});

export type AiEnv = z.infer<typeof AiEnvSchema>;

export function getAiEnv(): AiEnv {
  const parsed = AiEnvSchema.safeParse({
    AI_PROVIDER: process.env.AI_PROVIDER,
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    DEEPSEEK_BASE_URL: process.env.DEEPSEEK_BASE_URL,
    NSCALE_API_KEY: process.env.NSCALE_API_KEY,
    NSCALE_HEADER_NAME: process.env.NSCALE_HEADER_NAME,
  });

  if (!parsed.success) {
    throw new Error(
      'AI env invalid. Must run with AI_PROVIDER=deepseek and DEEPSEEK_API_KEY + NSCALE_API_KEY set.',
    );
  }

  return parsed.data;
}
