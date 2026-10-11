import type { RateLimitResult } from '@/modules/core/utils/rate-limit.util'
import { getAccessStore } from './accessStore'

export async function hitDistributedRateLimit(
  key: string,
  options: { windowMs: number; max: number },
): Promise<RateLimitResult> {
  const hit = await getAccessStore().incrRateLimit(key, options.windowMs)
  if (hit.count > options.max) {
    return { ok: false, remaining: 0, resetAt: hit.resetAt }
  }
  return {
    ok: true,
    remaining: Math.max(0, options.max - hit.count),
    resetAt: hit.resetAt,
  }
}

export function applyRateLimitHeaders(
  event: Parameters<typeof setResponseHeader>[0],
  result: RateLimitResult,
) {
  if (result.ok) return
  const retryAfter = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000))
  setResponseHeader(event, 'Retry-After', String(retryAfter))
  throw createError({
    statusCode: 429,
    statusMessage: 'Too many requests',
    data: { code: 'RATE_LIMITED' },
  })
}
