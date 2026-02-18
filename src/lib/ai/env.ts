import { z } from 'zod';

// Legacy schema for backward compatibility
export const aiEnvSchema = z.object({
  AI_PROVIDER: z.enum(['deepseek', 'github-models']).default('deepseek'),
  DEEPSEEK_API_KEY: z.string().min(1).optional(),
  DEEPSEEK_BASE_URL: z.string().url().optional(),
  NSCALE_API_KEY: z.string().min(1).optional(),
  NSCALE_HEADER_NAME: z.string().min(1).default('X-NSCALE-API-KEY'),
  GITHUB_TOKEN: z.string().min(1).optional(),
  GITHUB_MODELS_API_KEY: z.string().min(1).optional(),
  GITHUB_MODELS_BASE_URL: z.string().url().optional(),
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
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_MODELS_API_KEY: process.env.GITHUB_MODELS_API_KEY,
    GITHUB_MODELS_BASE_URL: process.env.GITHUB_MODELS_BASE_URL,
    AI_AUTO_SELECT: process.env.AI_AUTO_SELECT,
  });

  if (!parsed.success) {
    throw new Error(
      'AI env invalid. Must have either DEEPSEEK_API_KEY or GITHUB_TOKEN/GITHUB_MODELS_API_KEY set.'
    );
  }

  // Validate that at least one provider is configured
  const hasDeepSeek = !!parsed.data.DEEPSEEK_API_KEY;
  const hasGitHub = !!(parsed.data.GITHUB_TOKEN || parsed.data.GITHUB_MODELS_API_KEY);

  if (!hasDeepSeek && !hasGitHub) {
    throw new Error(
      'No AI provider configured. Set DEEPSEEK_API_KEY or GITHUB_TOKEN/GITHUB_MODELS_API_KEY.'
    );
  }

  // Warn if DeepSeek is used without NSCALE_API_KEY (if it's required)
  if (hasDeepSeek && !parsed.data.NSCALE_API_KEY && process.env.AI_PROVIDER === 'deepseek') {
    if (process.env.NODE_ENV !== 'test') {
      console.warn('Warning: DEEPSEEK_API_KEY is set but NSCALE_API_KEY is missing');
    }
  }

  return parsed.data;
}
