import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/ai/service', () => ({
  runChatCompletion: vi.fn().mockResolvedValue('mocked-response'),
}))

vi.mock('@/lib/supabase/server', () => ({
  createServerClient: async () => ({
    auth: {
      getUser: async () => ({ data: { user: { id: 'user-1' } } }),
    },
    from: () => ({
      insert: async () => ({ error: null }),
    }),
  }),
}))

import { POST } from '@/app/api/ai/chat/route'

describe('/api/ai/chat', () => {
  it('returns model output', async () => {
    const request = new Request('http://localhost/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'hello' }],
      }),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.output).toBe('mocked-response')
  })
})
