import { z } from 'zod';

export const chatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string().trim().min(1).max(8_000),
});

export const aiChatRequestSchema = z.object({
  model: z.string().trim().min(1).default('deepseek-chat'),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().positive().max(4_096).optional(),
  messages: z.array(chatMessageSchema).min(1).max(50),
});

export const aiChatSuccessResponseSchema = z.object({
  provider: z.literal('deepseek'),
  id: z.string(),
  choices: z.array(z.unknown()),
});

export const aiChatErrorResponseSchema = z.object({
  error: z.string(),
  code: z.string(),
  details: z.unknown().optional(),
});

export type AiChatRequest = z.infer<typeof aiChatRequestSchema>;
