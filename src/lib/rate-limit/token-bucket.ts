type BucketState = {
  tokens: number
  lastRefillMs: number
}

const buckets = new Map<string, BucketState>()

export function consumeRateLimitToken(
  key: string,
  capacity = 15,
  refillPerSecond = 0.25
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const current = buckets.get(key) ?? { tokens: capacity, lastRefillMs: now }
  const elapsedSeconds = Math.max(0, (now - current.lastRefillMs) / 1000)
  const replenished = Math.min(capacity, current.tokens + elapsedSeconds * refillPerSecond)

  if (replenished < 1) {
    buckets.set(key, { tokens: replenished, lastRefillMs: now })
    return { allowed: false, remaining: Math.floor(replenished) }
  }

  const remaining = replenished - 1
  buckets.set(key, { tokens: remaining, lastRefillMs: now })
  return { allowed: true, remaining: Math.floor(remaining) }
}
