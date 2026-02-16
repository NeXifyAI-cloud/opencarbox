import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createServerClient: async () => ({
    auth: {
      getSession: async () => ({ error: null }),
    },
  }),
}))

import { GET } from '@/app/api/health/route'

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'

describe('/api/health', () => {
  it('returns status payload', async () => {
    const response = await GET()
    const body = await response.json()

    expect(body.status).toBe('ok')
    expect(body.services.supabase).toBe('up')
  })
})
