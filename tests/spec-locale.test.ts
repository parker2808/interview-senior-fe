import { describe, expect, it } from 'vitest'
import { localeSpecPath, pickSpecMarkdown } from '@/modules/practice/utils/spec-locale.util'
import {
  headingSpecAnchorId,
  parseSpecSectionId,
  specAnchorId,
  specHeadingsFromMarkdown,
} from '@/modules/practice/utils/spec-ref.util'

describe('spec locale paths', () => {
  it('maps the English spec path to a sibling .vi.md file', () => {
    expect(localeSpecPath('plans/portfolio-design-system.md', 'en')).toBe(
      'plans/portfolio-design-system.md',
    )
    expect(localeSpecPath('plans/portfolio-design-system.md', 'vi')).toBe(
      'plans/portfolio-design-system.vi.md',
    )
  })

  it('falls back to English when Vietnamese markdown is missing', () => {
    expect(pickSpecMarkdown({ en: '# EN', vi: '' }, 'vi')).toEqual({
      markdown: '# EN',
      usedLocale: 'en',
    })
    expect(pickSpecMarkdown({ en: '# EN', vi: '# VI' }, 'vi')).toEqual({
      markdown: '# VI',
      usedLocale: 'vi',
    })
  })
})

describe('spec s- anchors', () => {
  it('uses s-N-M ids so EN/VI § refs share the same hash', () => {
    expect(specAnchorId('1.5')).toBe('s-1-5')
    expect(specAnchorId('3.1b')).toBe('s-3-1b')
    expect(headingSpecAnchorId('1.5 Navigation')).toBe('s-1-5')
    expect(parseSpecSectionId('#s-5-1')).toBe('5.1')
    const headings = specHeadingsFromMarkdown(
      '## 1. Product\n\n### 1.5 Navigation\n\n### 5.1 Home\n',
    )
    expect(headings.map((item) => item.id)).toEqual(['s-1', 's-1-5', 's-5-1'])
  })
})
