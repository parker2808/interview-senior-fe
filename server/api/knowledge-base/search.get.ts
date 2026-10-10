import { publicCacheHeaders } from '../../utils/contentStore'
import { searchKnowledgeBase } from '../../utils/kbSearch'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = String(query.q || '').trim()
  const lang = query.lang === 'en' ? 'en' : 'vi'
  const rawLimit = Number(query.limit)
  const limit = Number.isFinite(rawLimit)
    ? Math.min(50, Math.max(1, Math.trunc(rawLimit)))
    : 20

  setResponseHeaders(event, publicCacheHeaders())

  if (q.length < 2) {
    return { hits: [], q, lang, limit }
  }

  const hits = await searchKnowledgeBase(q, lang, limit)
  return { hits, q, lang, limit }
})
