import { describe, expect, it } from 'vitest'
import { filterPracticeSteps, practiceSearchHits } from '@/modules/practice/utils/practice-search.util'
import { allPracticeSteps } from './fixtures/practice-content-tree.mjs'
import type { PracticeStep } from '@/modules/content/types'

const steps = allPracticeSteps() as PracticeStep[]

describe('practice keyword search', () => {
  it('is diacritic-insensitive in Vietnamese', () => {
    const hits = filterPracticeSteps(steps, { query: 'hieu nang', lang: 'vi' })
    expect(hits.map((item) => item.id)).toContain('p02')
    expect(
      filterPracticeSteps(steps, { query: 'hiệu năng', lang: 'vi' }).map(
        (item) => item.id,
      ),
    ).toEqual(hits.map((item) => item.id))
  })

  it('requires every keyword (AND) across both languages', () => {
    const hits = filterPracticeSteps(steps, {
      query: 'prisma migrate',
      lang: 'en',
    })
    expect(hits.map((item) => item.id)).toContain('p06')
    expect(
      filterPracticeSteps(steps, { query: 'prisma bananas', lang: 'en' }),
    ).toEqual([])
  })

  it('matches title, tags/concept terms, and body (tasks + doneWhen + pitfalls)', () => {
    const title = practiceSearchHits(steps, 'prisma schema', 'en')
    expect(title[0]?.id).toBe('p06')
    expect(title[0]?.kind).toBe('title')

    const tags = practiceSearchHits(steps, 'mysql migrations', 'en')
    expect(tags.some((hit) => hit.id === 'p06' && hit.kind === 'tags')).toBe(true)

    const concept = filterPracticeSteps(steps, {
      query: 'source of truth',
      lang: 'en',
    })
    expect(concept.map((item) => item.id)).toContain('p06')

    const body = filterPracticeSteps(steps, {
      query: 'migrate dev',
      lang: 'en',
    })
    expect(body.map((item) => item.id)).toContain('p06')
  })

  it('ranks title matches above tags/concepts, then body', () => {
    const hits = practiceSearchHits(steps, 'prisma', 'en')
    const p06 = hits.find((hit) => hit.id === 'p06')
    const p07 = hits.find((hit) => hit.id === 'p07')
    expect(p06?.kind).toBe('title')
    expect(p07?.kind).toBe('body')
    expect(p06?.score ?? 0).toBeGreaterThan(p07?.score ?? 0)
    expect(hits[0]?.id).toBe('p06')
  })

  it('searches Vietnamese body copy without requiring the English phrase', () => {
    const hits = filterPracticeSteps(steps, {
      query: 'nguon su that',
      lang: 'vi',
    })
    expect(hits.map((item) => item.id)).toContain('p06')
  })
})
