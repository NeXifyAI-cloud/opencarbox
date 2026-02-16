import { z } from 'zod';

const envSchema = z.object({
  DEEPSEEK_API_KEY: z.string().optional(),
  DEEPSEEK_BASE_URL: z.string().url().default('https://api.deepseek.com'),
  DEEPSEEK_MODEL: z.string().default('deepseek-chat'),
  OPENAI_COMPAT_API_KEY: z.string().optional(),
  OPENAI_COMPAT_BASE_URL: z.string().url().default('https://api.openai.com/v1'),
  OPENAI_COMPAT_MODEL: z.string().default('gpt-4o-mini'),
  NSCALE_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
