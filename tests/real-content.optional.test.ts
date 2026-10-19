import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import type { KnowledgeDoc } from '@/modules/content/types'
import type { InterviewQuestion } from '@/modules/interview-qa/types/interview.type'
import { searchKnowledgeDocs } from '@/modules/knowledge-base/utils/kb-search-core.util'
import { filterInterviewQuestions } from '@/modules/interview-qa/utils/qa-search.util'
import { foldSearchText, splitSearchKeywords } from '@/modules/knowledge-base/utils/search-text.util'

const contentDir = process.env.CONTENT_DIR || path.resolve('.data/content')
const kbDir = path.join(contentDir, 'knowledge-base')
const kbFiles = existsSync(kbDir)
  ? readdirSync(kbDir).filter((name) => name.endsWith('.json') && name !== 'index.json')
  : []
const hasRealTree = kbFiles.length >= 10

const SKIP_KEYS = new Set([
  'id',
  'type',
  'style',
  'kind',
  'align',
  'level',
  'lang',
  'slug',
  'category',
  'order',
  'tags',
])

function readJson<T>(rel: string): T {
  return JSON.parse(readFileSync(path.join(contentDir, rel), 'utf8')) as T
}

function localizedBlob(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(localizedBlob).join(' ')
  if (typeof value !== 'object') return ''
  const rec = value as Record<string, unknown>
  if (typeof rec.en === 'string' && typeof rec.vi === 'string') {
    return `${rec.en} ${rec.vi}`
  }
  return Object.entries(rec)
    .filter(([key]) => !SKIP_KEYS.has(key))
    .map(([, child]) => localizedBlob(child))
    .join(' ')
}

function distinctiveQuery(text: string): string | null {
  const words = foldSearchText(text)
    .split(/\s+/)
    .filter((word) => word.length >= 6)
  const counts = new Map<string, number>()
  for (const word of words) counts.set(word, (counts.get(word) || 0) + 1)
  const unique = words.filter((word) => counts.get(word) === 1)
  if (unique.length >= 2) return `${unique[0]} ${unique[1]}`
  return unique[0] || words[0] || null
}

describe.skipIf(!hasRealTree)('real interview-fe-data content', () => {
  const docs = hasRealTree
    ? kbFiles.map((file) => readJson<KnowledgeDoc>(`knowledge-base/${file}`))
    : []
  const questions = hasRealTree
    ? readJson<{ questions: InterviewQuestion[] }>('qna/questions.json').questions
    : []

  it('has bilingual KB docs and Q&A example/followUps', () => {
    expect(docs.length).toBeGreaterThanOrEqual(10)
    expect(questions.length).toBeGreaterThan(0)
    const withExample = questions.filter((item) => item.example?.en && item.example?.vi)
    const withFollowUps = questions.filter((item) => item.followUps?.length)
    expect(withExample.length).toBeGreaterThan(0)
    expect(withFollowUps.length).toBeGreaterThan(0)
  })

  it('keyword-searches distinctive text from each KB block type in vi and en', () => {
    const byType = new Map<string, { lang: 'vi' | 'en'; query: string; slug: string }>()
    for (const doc of docs) {
      for (const section of doc.sections || []) {
        for (const block of section.blocks || []) {
          if (byType.has(block.type) || block.type === 'thematic-break') continue
          const blob = localizedBlob(block)
          const query = distinctiveQuery(blob)
          if (!query || splitSearchKeywords(query).length < 1) continue
          byType.set(block.type, {
            lang: 'en',
            query,
            slug: doc.slug,
          })
        }
      }
    }

    const expected = [
      'senior-answer',
      'paragraph',
      'heading',
      'callout',
      'table',
      'list',
      'key-takeaways',
      'code',
    ]
    for (const type of expected) {
      const probe = byType.get(type)
      expect(probe, `missing searchable text for block type ${type}`).toBeTruthy()
      const enHits = searchKnowledgeDocs(docs, probe!.query, 'en', 50)
      const viHits = searchKnowledgeDocs(docs, probe!.query, 'vi', 50)
      expect(
        enHits.some((hit) => hit.slug === probe!.slug) ||
          viHits.some((hit) => hit.slug === probe!.slug),
        `${type} query "${probe!.query}" missed slug ${probe!.slug}`,
      ).toBe(true)
    }
  })

  it('matches a few real vi/en queries with and without diacritics', () => {
    const viPlain = searchKnowledgeDocs(docs, 'hieu nang', 'vi', 20)
    const viAccent = searchKnowledgeDocs(docs, 'hiệu năng', 'vi', 20)
    expect(viPlain.length).toBeGreaterThan(0)
    expect(viAccent.map((hit) => hit.id).sort()).toEqual(
      viPlain.map((hit) => hit.id).sort(),
    )
    expect(
      viPlain.some((hit) => /hiệu năng/i.test(`${hit.headingTitle} ${hit.title}`)),
    ).toBe(true)

    const enHits = searchKnowledgeDocs(docs, 'event loop', 'en', 20)
    expect(enHits.some((hit) => hit.slug === 'javascript')).toBe(true)

    const fromExample = questions.find((item) => item.id === 'self-intro')
    expect(fromExample?.example?.en).toBeTruthy()
    const exampleHits = filterInterviewQuestions(questions, {
      query: 'internal admin product',
      lang: 'en',
    })
    expect(exampleHits.some((item) => item.id === 'self-intro')).toBe(true)

    const followHits = filterInterviewQuestions(questions, {
      query: 'chieu sau production vue',
      lang: 'vi',
    })
    expect(followHits.some((item) => item.id === 'self-intro')).toBe(true)
  })
})
