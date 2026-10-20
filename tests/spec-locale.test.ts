import { describe, expect, it } from 'vitest'
import { localeSpecPath, pickSpecMarkdown } from '@/modules/practice/utils/spec-locale.util'
import {
  headingSpecAnchorId,
  matchingSpecHeadingIds,
  parseSpecSectionId,
  renderSpecMarkdown,
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
    const fromMarkdown = specHeadingsFromMarkdown(
      '## 1. Product\n\n### 1.5 Navigation\n\n### 5.1 Home\n',
    )
    expect(fromMarkdown.map((item) => item.id)).toEqual(['s-1', 's-1-5', 's-5-1'])

    const htmlSpec = [
      '<h2 id="s-1">1. Product</h2>',
      '<h3 id="s-1-5">1.5 Navigation</h3>',
      'Primary nav sits in the header.',
      '<h3 id="s-3-1b">3.1b Atmosphere</h3>',
      '<h3 id="s-5-1">5.1 Home</h3>',
    ].join('\n\n')
    const fromHtml = specHeadingsFromMarkdown(htmlSpec)
    expect(fromHtml.map((item) => item.id)).toEqual(['s-1', 's-1-5', 's-3-1b', 's-5-1'])
    expect(renderSpecMarkdown(htmlSpec).html).toContain('id="s-3-1b"')
    expect(matchingSpecHeadingIds(htmlSpec, fromHtml, 'nav header')).toContain('s-1-5')
  })
})
