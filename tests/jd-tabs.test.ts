import { describe, expect, it } from 'vitest'
import { tabEntries, liveKbHref } from '../src/modules/jd/utils/jd-tabs.util'
import type { JdModule } from '../src/modules/jd/types/entities/jd-module.type'

const module: JdModule = { version: 2, slug: 'fictional', requirements: [], entries: [
  { id: 'q', section: 'interview', jdRequirement: 'sample', tags: [], title: { en: 'Question', vi: 'Câu hỏi' }, shortAnswer: { en: 'Short', vi: 'Ngắn' }, detail: { en: 'Detail', vi: 'Chi tiết' }, keyPoints: [] },
] }

describe('JD module tabs', () => {
  it('places questions in Q&A without mutating FDE answers', () => {
    expect(tabEntries(module, 'interview')[0]?.shortAnswer.en).toBe('Short')
    expect(tabEntries(module, 'cv')).toEqual([])
  })
  it('does not publish pending knowledge links', () => {
    expect(liveKbHref({ slug: 'example', sectionId: 'focus', state: 'pending' }, 'vi')).toBeNull()
    expect(liveKbHref({ slug: 'example', sectionId: 'focus', state: 'live' }, 'vi')).toBe('/docs/vi/example#focus')
  })
})
