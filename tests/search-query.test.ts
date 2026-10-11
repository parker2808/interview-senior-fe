import { describe, expect, it } from 'vitest'
import { parseSearchQuery, SEARCH_Q_MAX } from '../src/modules/core/utils/search-query.util'

describe('parseSearchQuery', () => {
  it('accepts a valid query and caps limit', () => {
    expect(parseSearchQuery({ q: 'hoisting', lang: 'en', limit: 999 })).toEqual({
      ok: true,
      q: 'hoisting',
      lang: 'en',
      limit: 50,
    })
  })

  it('defaults lang to vi and limit to 20', () => {
    expect(parseSearchQuery({ q: '  vue  ' })).toEqual({
      ok: true,
      q: 'vue',
      lang: 'vi',
      limit: 20,
    })
  })

  it('rejects oversized q', () => {
    const result = parseSearchQuery({ q: 'x'.repeat(SEARCH_Q_MAX + 1) })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors[0]).toMatch(/at most 100/)
    }
  })

  it('rejects invalid lang and limit', () => {
    const result = parseSearchQuery({ q: 'ok', lang: 'fr', limit: 'nope' })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors).toContain('lang must be vi or en')
      expect(result.errors).toContain('limit must be a positive integer')
    }
  })
})
