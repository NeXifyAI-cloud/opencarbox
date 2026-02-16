import { describe, expect, it } from 'vitest'

import { getEnv } from '@/lib/config/env'

describe('env config', () => {
  it('validates required env variables', () => {
    const env = getEnv({
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
    })

    expect(env.AI_DEFAULT_PROVIDER).toBe('deepseek')
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toContain('supabase')
  })
})
