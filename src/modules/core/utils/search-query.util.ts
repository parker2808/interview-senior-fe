export const SEARCH_Q_MAX = 100
export const SEARCH_LIMIT_MAX = 50
export const SEARCH_LIMIT_DEFAULT = 20
export const SEARCH_Q_MIN = 2

export type SearchQueryInput = {
  q?: unknown
  lang?: unknown
  limit?: unknown
}

export type ParsedSearchQuery = {
  ok: true
  q: string
  lang: 'vi' | 'en'
  limit: number
}

export type InvalidSearchQuery = {
  ok: false
  errors: string[]
}

export type SearchQueryResult = ParsedSearchQuery | InvalidSearchQuery

function isPlainScalar(value: unknown) {
  return (
    value == null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}

export function parseSearchQuery(input: SearchQueryInput): SearchQueryResult {
  const errors: string[] = []

  if (!isPlainScalar(input.q)) {
    errors.push('q must be a string')
  }
  const q = String(input.q ?? '').trim()
  if (q.length > SEARCH_Q_MAX) {
    errors.push(`q must be at most ${SEARCH_Q_MAX} characters`)
  }

  if (input.lang != null && input.lang !== '') {
    if (!isPlainScalar(input.lang)) {
      errors.push('lang must be vi or en')
    } else {
      const lang = String(input.lang).trim()
      if (lang !== 'vi' && lang !== 'en') {
        errors.push('lang must be vi or en')
      }
    }
  }

  let limit = SEARCH_LIMIT_DEFAULT
  if (input.limit != null && input.limit !== '') {
    if (!isPlainScalar(input.limit)) {
      errors.push('limit must be a positive integer')
    } else {
      const raw = String(input.limit).trim()
      const parsed = Number(raw)
      if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed < 1) {
        errors.push('limit must be a positive integer')
      } else {
        limit = Math.min(SEARCH_LIMIT_MAX, parsed)
      }
    }
  }

  if (errors.length) return { ok: false, errors }

  return {
    ok: true,
    q,
    lang: String(input.lang || '').trim() === 'en' ? 'en' : 'vi',
    limit,
  }
}
