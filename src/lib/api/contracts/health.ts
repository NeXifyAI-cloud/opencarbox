import { z } from 'zod';

export const dependencyStateSchema = z.object({
  status: z.enum(['up', 'down', 'degraded']),
  latencyMs: z.number().int().nonnegative().nullable(),
  details: z.string().optional(),
});

export const healthResponseSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  timestamp: z.string().datetime(),
  dependencies: z.object({
    database: dependencyStateSchema,
    aiService: dependencyStateSchema,
  }),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
