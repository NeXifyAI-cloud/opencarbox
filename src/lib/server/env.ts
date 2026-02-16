import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  DEEPSEEK_API_KEY: z.string().min(1).optional(),
  OPENAI_COMPAT_API_KEY: z.string().min(1).optional(),
  OPENAI_COMPAT_BASE_URL: z.string().url().optional(),
  NSCALE_API_KEY: z.string().min(1).optional(),
  NSCALE_HEADER_NAME: z.string().min(1).default('X-NSCALE-API-KEY'),
  AI_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),
  AI_MAX_RETRIES: z.coerce.number().int().min(0).max(3).default(2),
});

export const serverEnv = envSchema.parse(process.env);
