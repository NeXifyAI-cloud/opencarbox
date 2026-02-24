import { z } from 'zod';

// Legacy schema for backward compatibility
export const aiEnvSchema = z.object({
  AI_PROVIDER: z.enum(['deepseek', 'github-models', 'nscale']).default('deepseek'),
  DEEPSEEK_API_KEY: z.string().min(1).optional(),
  DEEPSEEK_BASE_URL: z.string().url().optional(),
  NSCALE_API_KEY: z.string().min(1).optional(),
  NSCALE_HEADER_NAME: z.string().min(1).default('X-NSCALE-API-KEY'),
  AI_AUTO_SELECT: z.string().optional(),
});

export type AiEnv = z.infer<typeof aiEnvSchema>;

/**
 * Get AI environment configuration
 * @deprecated Use getProviderConfigFromEnv from providers/config instead
 */
export function getAiEnv(): AiEnv {
  const parsed = aiEnvSchema.safeParse({
    AI_PROVIDER: process.env.AI_PROVIDER || 'deepseek',
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    DEEPSEEK_BASE_URL: process.env.DEEPSEEK_BASE_URL,
    NSCALE_API_KEY: process.env.NSCALE_API_KEY,
    NSCALE_HEADER_NAME: process.env.NSCALE_HEADER_NAME,
    AI_AUTO_SELECT: process.env.AI_AUTO_SELECT,
  });

  if (!parsed.success) {
    throw new Error(
      'AI env invalid. Must have DEEPSEEK_API_KEY and NSCALE_API_KEY set.'
    );
  }

  if (!parsed.data.DEEPSEEK_API_KEY || !parsed.data.NSCALE_API_KEY) {
    throw new Error('No AI provider configured. Set DEEPSEEK_API_KEY and NSCALE_API_KEY.');
  }

  return parsed.data;
}
