import { describe, expect, it } from 'vitest'
import { searchCatalogTitles } from '@/modules/knowledge-base/utils/doc-search-index.util'
import { searchKnowledgeDocs } from '@/modules/knowledge-base/utils/kb-search-core.util'
import { sampleKnowledgeDoc } from './fixtures/search-content'
import type { KnowledgeCatalog } from '@/modules/content/types'

describe('knowledge base keyword search', () => {
  it('matches Vietnamese diacritics against headings', () => {
    const hits = searchKnowledgeDocs([sampleKnowledgeDoc], 'hieu nang', 'vi')
    expect(hits[0]?.headingTitle).toMatch(/Hiệu năng/i)
    expect(hits[0]?.kind).toBe('heading')
    expect(hits[0]?.headingId).toBe('hieu-nang-build')
  })

  it('AND-matches multi-word queries that are not an exact phrase', () => {
    const hits = searchKnowledgeDocs(
      [sampleKnowledgeDoc],
      'cache splitchunks',
      'en',
    )
    expect(hits.some((hit) => hit.slug === 'javascript')).toBe(true)
    expect(
      searchKnowledgeDocs([sampleKnowledgeDoc], 'cache bananas', 'en'),
    ).toEqual([])
  })

  it('matches when keywords are split across title and body', () => {
    const hits = searchKnowledgeDocs(
      [sampleKnowledgeDoc],
      'javascript splitchunks',
      'en',
    )
    expect(hits.some((hit) => hit.kind === 'body')).toBe(true)
  })

  it('ranks title/heading matches above body matches', () => {
    const hits = searchKnowledgeDocs([sampleKnowledgeDoc], 'javascript', 'en')
    expect(hits[0]?.kind).toBe('title')
    const heading = hits.find((hit) => hit.kind === 'heading')
    const body = hits.find((hit) => hit.kind === 'body')
    if (heading && body) expect(heading.score).toBeGreaterThan(body.score)
  })

  it('indexes senior-answer, nested example, follow-ups, and example blocks in both locales', () => {
    const vi = searchKnowledgeDocs([sampleKnowledgeDoc], 'banner throw', 'vi')
    const en = searchKnowledgeDocs(
      [sampleKnowledgeDoc],
      'eventloopmicrotask',
      'en',
    )
    const follow = searchKnowledgeDocs([sampleKnowledgeDoc], 'long task ci', 'en')
    expect(vi.some((hit) => hit.kind === 'body')).toBe(true)
    expect(en[0]?.snippet.toLowerCase()).toContain('eventloopmicrotask')
    expect(follow.length).toBeGreaterThan(0)
  })

  it('finds body text from key-takeaways without requiring the exact phrase', () => {
    const hits = searchKnowledgeDocs([sampleKnowledgeDoc], 'uu tien const', 'vi')
    expect(hits.length).toBeGreaterThan(0)
  })

  it('searches catalog summaries with the same keyword rules', () => {
    const catalog: KnowledgeCatalog = {
      defaultSlug: 'javascript',
      docs: [
        {
          slug: 'javascript',
          title: sampleKnowledgeDoc.title,
          summary: sampleKnowledgeDoc.summary,
          category: 'core',
          order: 1,
          tags: ['js'],
          headings: [
            {
              id: { en: 'build-perf', vi: 'hieu-nang-build' },
              text: {
                en: 'Build performance on CI',
                vi: 'Hiệu năng build trên CI',
              },
              level: 2,
            },
          ],
        },
      ],
      groups: [],
    }
    const hits = searchCatalogTitles('hieu nang', 'vi', catalog)
    expect(hits[0]?.slug).toBe('javascript')
    expect(searchCatalogTitles('hieu bananas', 'vi', catalog)).toEqual([])
  })
})
