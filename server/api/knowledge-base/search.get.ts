import { publicCacheHeaders } from '@/modules/core/utils/cache-headers.util'
import { parseSearchQuery, SEARCH_Q_MIN } from '@/modules/core/utils/search-query.util'
import { searchKnowledgeBase } from '../../utils/kbSearch'
import { getClientIp } from '../../utils/requestIp'
import { searchRateLimiter } from '../../utils/searchRateLimit'

export default defineEventHandler(async (event) => {
  const parsed = parseSearchQuery(getQuery(event))
  if (!parsed.ok) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.errors[0] || 'Invalid search query',
      data: { code: 'BAD_QUERY', errors: parsed.errors },
    })
  }

  const limitHit = searchRateLimiter.check(getClientIp(event))
  if (!limitHit.ok) {
    const retryAfter = Math.max(
      1,
      Math.ceil((limitHit.resetAt - Date.now()) / 1000),
    )
    setResponseHeader(event, 'Retry-After', String(retryAfter))
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many search requests',
      data: { code: 'RATE_LIMITED' },
    })
  }

  setResponseHeaders(event, publicCacheHeaders())

  if (parsed.q.length < SEARCH_Q_MIN) {
    return { hits: [], q: parsed.q, lang: parsed.lang, limit: parsed.limit }
  }

  const hits = await searchKnowledgeBase(parsed.q, parsed.lang, parsed.limit)
  return { hits, q: parsed.q, lang: parsed.lang, limit: parsed.limit }
})
