const WINDOW_MS = 60_000;
const LIMIT = 20;

type Entry = { count: number; resetAt: number };

const bucket = new Map<string, Entry>();

export function checkRateLimit(key: string): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const current = bucket.get(key);

  if (!current || current.resetAt <= now) {
    const next: Entry = { count: 1, resetAt: now + WINDOW_MS };
    bucket.set(key, next);
    return { ok: true, remaining: LIMIT - 1, resetAt: next.resetAt };
  }

  current.count += 1;
  bucket.set(key, current);

  if (current.count > LIMIT) {
    return { ok: false, remaining: 0, resetAt: current.resetAt };
  }

  return { ok: true, remaining: LIMIT - current.count, resetAt: current.resetAt };
}

export function __resetRateLimitForTests(): void {
  bucket.clear();
}
