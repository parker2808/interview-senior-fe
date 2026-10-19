import { describe, expect, it } from 'vitest'
import {
  foldSearchText,
  highlightSearchText,
  matchesAllKeywords,
  splitSearchKeywords,
} from '@/modules/knowledge-base/utils/search-text.util'

describe('splitSearchKeywords', () => {
  it('folds Vietnamese diacritics and splits on whitespace', () => {
    expect(splitSearchKeywords('  Hiệu Năng  ')).toEqual(['hieu', 'nang'])
    expect(splitSearchKeywords('Đóng gói')).toEqual(['dong', 'goi'])
  })

  it('drops duplicate keywords and 1-char noise', () => {
    expect(splitSearchKeywords('a hoisting hoisting')).toEqual(['hoisting'])
  })
})

describe('matchesAllKeywords', () => {
  it('requires every keyword, not the exact phrase', () => {
    const hay = foldSearchText('Hiệu năng build trên CI')
    expect(matchesAllKeywords(hay, ['hieu', 'nang'])).toBe(true)
    expect(matchesAllKeywords(hay, ['hieu', 'webpack'])).toBe(false)
  })
})

describe('highlightSearchText', () => {
  it('marks each keyword independently', () => {
    const html = highlightSearchText('Hiệu năng build', 'hieu nang')
    expect(html).toContain('<mark')
    expect(html).toMatch(/Hiệu/)
    expect(html).toMatch(/năng/i)
  })
})
