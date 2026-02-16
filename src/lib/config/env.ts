import { z } from 'zod';

const trueFalse = z.enum(['true', 'false']).optional();

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  DEEPSEEK_API_KEY: z.string().min(1).optional(),
  DEEPSEEK_BASE_URL: z.string().url().optional(),
  NSCALE_API_KEY: z.string().min(1).optional(),
  NSCALE_HEADER_NAME: z.string().default('X-NSCALE-API-KEY'),
  AI_PROVIDER: z.enum(['deepseek']).default('deepseek'),
  AI_DEFAULT_MODEL: z.string().default('deepseek-chat'),
  RATE_LIMIT_PER_MINUTE: z.coerce.number().int().positive().default(20),
  AI_TIMEOUT_MS: z.coerce.number().int().positive().default(30000),
  SENTRY_DSN: z.string().url().optional(),
  FEATURE_AI_CHAT: trueFalse,
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export const env = {
  server: serverSchema.parse(process.env),
  client: clientSchema.parse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }),
};

export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;
