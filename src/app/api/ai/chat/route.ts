import { NextResponse } from 'next/server'
import { z } from 'zod'

import { runChatCompletion } from '@/lib/ai/service'
import { logAiEvent } from '@/lib/logging/safe-logger'
import { consumeRateLimitToken } from '@/lib/rate-limit/token-bucket'
import { createServerClient } from '@/lib/supabase/server'

const requestSchema = z.object({
  provider: z.enum(['deepseek', 'openai_compat']).optional(),
  model: z.string().min(1).max(200).optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string().min(1).max(5000),
      })
    )
    .min(1)
    .max(30),
})

type AiLogInsert = {
  user_id: string
  provider: string
  model: string
  latency_ms: number
  success: boolean
  error_code: string | null
}

type AiLogsTable = {
  insert: (payload: AiLogInsert) => Promise<unknown>
}

export async function POST(request: Request): Promise<NextResponse> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 })
  }

  const rateLimit = consumeRateLimitToken(`ai:${user.id}`)
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 })
  }

  const body = await request.json()
  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_PAYLOAD', issues: parsed.error.flatten() }, { status: 400 })
  }

  const startedAt = Date.now()
  const aiLogs = supabase.from('ai_logs') as unknown as AiLogsTable

  try {
    const output = await runChatCompletion(parsed.data.messages, parsed.data.provider, parsed.data.model)
    const latencyMs = Date.now() - startedAt

    await aiLogs.insert({
      user_id: user.id,
      provider: parsed.data.provider ?? 'default',
      model: parsed.data.model ?? 'default',
      latency_ms: latencyMs,
      success: true,
      error_code: null,
    })

    logAiEvent('ai-chat-success', {
      userId: user.id,
      provider: parsed.data.provider,
      model: parsed.data.model,
      latencyMs,
      success: true,
    })

    return NextResponse.json({ output, latencyMs, remaining: rateLimit.remaining })
  } catch (error) {
    const latencyMs = Date.now() - startedAt
    const errorCode = error instanceof Error ? error.message : 'UNKNOWN_ERROR'

    await aiLogs.insert({
      user_id: user.id,
      provider: parsed.data.provider ?? 'default',
      model: parsed.data.model ?? 'default',
      latency_ms: latencyMs,
      success: false,
      error_code: errorCode,
    })

    logAiEvent('ai-chat-failed', {
      userId: user.id,
      provider: parsed.data.provider,
      model: parsed.data.model,
      latencyMs,
      success: false,
      errorCode,
    })

    return NextResponse.json({ error: 'AI_UPSTREAM_FAILED', code: errorCode }, { status: 502 })
  }
}
