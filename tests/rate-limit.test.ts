import { describe, expect, it } from 'vitest'
import { createMemoryRateLimiter } from '../src/modules/core/utils/rate-limit.util'

describe('createMemoryRateLimiter', () => {
  it('allows up to max hits in the window then blocks', () => {
    const limiter = createMemoryRateLimiter({ windowMs: 1_000, max: 2 })
    const now = 1_000
    expect(limiter.check('ip', now).ok).toBe(true)
    expect(limiter.check('ip', now + 10).ok).toBe(true)
    expect(limiter.check('ip', now + 20).ok).toBe(false)
    expect(limiter.check('ip', now + 1_001).ok).toBe(true)
  })
})
