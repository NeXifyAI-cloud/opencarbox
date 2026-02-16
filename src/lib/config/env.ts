import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  DEEPSEEK_API_KEY: z.string().min(1).optional(),
  OPENAI_COMPAT_API_KEY: z.string().min(1).optional(),
  OPENAI_COMPAT_BASE_URL: z.string().url().optional(),
  NSCALE_API_KEY: z.string().min(1).optional(),
  AI_DEFAULT_PROVIDER: z.enum(['deepseek', 'openai_compat']).default('deepseek'),
  AI_DEFAULT_MODEL: z.string().min(1).default('deepseek-chat'),
})

export type AppEnv = z.infer<typeof envSchema>

export function getEnv(overrides?: Partial<Record<keyof AppEnv, string | undefined>>): AppEnv {
  const source = {
    ...process.env,
    ...overrides,
  }

  return envSchema.parse(source)
}
