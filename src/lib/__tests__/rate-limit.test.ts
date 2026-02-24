import { describe, it, expect, beforeEach } from 'vitest'
import { createRateLimiter } from '../rate-limit'
import { NextRequest } from 'next/server'

describe('Rate Limiter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should allow requests within limit', async () => {
    const limiter = createRateLimiter({
      windowMs: 60000,
      maxRequests: 5,
    })

    const mockRequest = new NextRequest(new URL('http://localhost'), {
      headers: { 'x-forwarded-for': '192.168.1.1' },
    })

    const result = await limiter(mockRequest)

    expect(result.allowed).toBe(true)
    expect(result.remaining).toBeLessThanOrEqual(5)
  })

  it('should track request count', async () => {
    const limiter = createRateLimiter({
      windowMs: 60000,
      maxRequests: 3,
    })

    const mockRequest = new NextRequest(new URL('http://localhost'), {
      headers: { 'x-forwarded-for': '192.168.1.2' },
    })

    let result = await limiter(mockRequest)
    expect(result.remaining).toBe(2)

    result = await limiter(mockRequest)
    expect(result.remaining).toBe(1)

    result = await limiter(mockRequest)
    expect(result.remaining).toBe(0)

    result = await limiter(mockRequest)
    expect(result.allowed).toBe(false)
  })

  it('should use custom key function', async () => {
    const limiter = createRateLimiter({
      windowMs: 60000,
      maxRequests: 1,
      key: (req) => req.headers.get('x-custom-key') || 'default',
    })

    const mockRequest = new NextRequest(new URL('http://localhost'), {
      headers: { 'x-custom-key': 'custom-value' },
    })

    const result = await limiter(mockRequest)
    expect(result.allowed).toBe(true)
  })

  it('should return retry after time', async () => {
    const limiter = createRateLimiter({
      windowMs: 1000,
      maxRequests: 1,
    })

    const mockRequest = new NextRequest(new URL('http://localhost'), {
      headers: { 'x-forwarded-for': '192.168.1.3' },
    })

    await limiter(mockRequest)
    const result = await limiter(mockRequest)

    expect(result.retryAfter).toBeGreaterThan(0)
    expect(result.retryAfter).toBeLessThanOrEqual(1)
  })
})

import { vi } from 'vitest'
