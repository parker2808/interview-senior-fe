import { createMemoryRateLimiter } from '@/modules/core/utils/rate-limit.util'

/** Best-effort per-instance limit. Vercel Firewall is the real protection. */
export const searchRateLimiter = createMemoryRateLimiter({
  windowMs: 60_000,
  max: 30,
})
