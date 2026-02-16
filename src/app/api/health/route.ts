import { NextResponse } from 'next/server'

import { getEnv } from '@/lib/config/env'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(): Promise<NextResponse> {
  const env = getEnv()
  const supabase = await createServerClient()
  const startedAt = Date.now()

  const { error } = await supabase.auth.getSession()

  return NextResponse.json({
    status: error ? 'degraded' : 'ok',
    appUrl: env.NEXT_PUBLIC_APP_URL,
    services: {
      supabase: error ? 'down' : 'up',
      aiDefaultProvider: env.AI_DEFAULT_PROVIDER,
    },
    latencyMs: Date.now() - startedAt,
    timestamp: new Date().toISOString(),
  })
}
