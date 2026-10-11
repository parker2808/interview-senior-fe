import { publicCacheHeaders } from '@/modules/core/utils/cache-headers.util'
import { parseSearchQuery, SEARCH_Q_MIN } from '@/modules/core/utils/search-query.util'
import { searchKnowledgeBase } from '../../utils/kbSearch'
import { getClientIp } from '../../utils/requestIp'
import {
  applyRateLimitHeaders,
  hitDistributedRateLimit,
} from '../../utils/distributedRateLimit'

export default defineEventHandler(async (event) => {
  const parsed = parseSearchQuery(getQuery(event))
  if (!parsed.ok) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.errors[0] || 'Invalid search query',
      data: { code: 'BAD_QUERY', errors: parsed.errors },
    })
  }

  const limitHit = await hitDistributedRateLimit(`search:${getClientIp(event)}`, {
    windowMs: 60_000,
    max: 30,
  })
  if (!limitHit.ok) applyRateLimitHeaders(event, limitHit)

  setResponseHeaders(event, publicCacheHeaders())

  if (parsed.q.length < SEARCH_Q_MIN) {
    return { hits: [], q: parsed.q, lang: parsed.lang, limit: parsed.limit }
  }

  const hits = await searchKnowledgeBase(parsed.q, parsed.lang, parsed.limit)
  return { hits, q: parsed.q, lang: parsed.lang, limit: parsed.limit }
})
