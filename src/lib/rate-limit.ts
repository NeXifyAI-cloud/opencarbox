import { NextRequest, NextResponse } from 'next/server'

// In-memory rate limiter (production should use Redis)
// For now using simple in-memory solution with cleanup
const requestCounts = new Map<string, { count: number; resetTime: number }>()

const CLEANUP_INTERVAL = 60000 // Cleanup every minute

// Cleanup old entries
setInterval(() => {
  const now = Date.now()
  for (const [key, data] of requestCounts.entries()) {
    if (data.resetTime < now) {
      requestCounts.delete(key)
    }
  }
}, CLEANUP_INTERVAL)

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  key?: (request: NextRequest) => string // Function to generate rate limit key
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter: number
}

export function createRateLimiter(config: RateLimitConfig) {
  return async (request: NextRequest): Promise<RateLimitResult> => {
    const key = config.key?.(request) || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const now = Date.now()

    const current = requestCounts.get(key) || { count: 0, resetTime: now + config.windowMs }

    // Reset if window expired
    if (current.resetTime < now) {
      current.count = 0
      current.resetTime = now + config.windowMs
    }

    current.count++
    requestCounts.set(key, current)

    const allowed = current.count <= config.maxRequests
    const remaining = Math.max(0, config.maxRequests - current.count)
    const resetTime = current.resetTime
    const retryAfter = Math.ceil((resetTime - now) / 1000)

    return {
      allowed,
      remaining,
      resetTime,
      retryAfter,
    }
  }
}

// Pre-configured rate limiters
export const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
})

export const apiRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
})

export const generalRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 1000,
})

export function handleRateLimitError(result: RateLimitResult) {
  return NextResponse.json(
    {
      success: false,
      error: 'Too many requests. Please try again later.',
      retryAfter: result.retryAfter,
    },
    {
      status: 429,
      headers: {
        'Retry-After': result.retryAfter.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
      },
    }
  )
}
