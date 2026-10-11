export type RateLimitResult = {
  ok: boolean
  remaining: number
  resetAt: number
}

export function createMemoryRateLimiter(options: {
  windowMs: number
  max: number
}) {
  const hits = new Map<string, { count: number; resetAt: number }>()

  function prune(now: number) {
    if (hits.size < 500) return
    for (const [key, value] of hits) {
      if (value.resetAt <= now) hits.delete(key)
    }
  }

  return {
    check(key: string, now = Date.now()): RateLimitResult {
      prune(now)
      const current = hits.get(key)
      if (!current || current.resetAt <= now) {
        const resetAt = now + options.windowMs
        hits.set(key, { count: 1, resetAt })
        return { ok: true, remaining: options.max - 1, resetAt }
      }
      if (current.count >= options.max) {
        return { ok: false, remaining: 0, resetAt: current.resetAt }
      }
      current.count += 1
      return {
        ok: true,
        remaining: options.max - current.count,
        resetAt: current.resetAt,
      }
    },
    reset() {
      hits.clear()
    },
  }
}
