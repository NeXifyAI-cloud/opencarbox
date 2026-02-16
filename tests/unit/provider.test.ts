import { describe, expect, it, vi } from 'vitest'

import { createAiProvider } from '@/lib/ai/client'

describe('provider adapters', () => {
  it('sends NSCALE header on openai_compat', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'ok' } }] }),
    })

    vi.stubGlobal('fetch', fetchMock)

    const provider = createAiProvider('openai_compat', {
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon',
      AI_DEFAULT_PROVIDER: 'openai_compat',
      AI_DEFAULT_MODEL: 'gpt-test',
      OPENAI_COMPAT_BASE_URL: 'https://compat.example.com',
      OPENAI_COMPAT_API_KEY: 'compat-key',
      NSCALE_API_KEY: 'nscale-key',
    })

    await provider.chatCompletion([{ role: 'user', content: 'hello' }])

    const headers = fetchMock.mock.calls[0][1].headers
    expect(headers['X-NSCALE-API-KEY']).toBe('nscale-key')
  })
})
