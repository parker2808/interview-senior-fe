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

function readJson<T>(rel: string): T {
  return JSON.parse(readFileSync(path.join(contentDir, rel), 'utf8')) as T
}

function distinctiveToken(text: string): string | null {
  const folded = foldSearchText(text)
  const words = folded.split(/\s+/).filter((word) => word.length >= 5)
  const unique = words.find((word) => words.filter((other) => other === word).length === 1)
  return unique || words[0] || null
}

describe.skipIf(!hasRealTree)('real interview-fe-data content', () => {
  const docs = kbFiles.map((file) =>
    readJson<KnowledgeDoc>(`knowledge-base/${file}`),
  )
  const questions = readJson<{ questions: InterviewQuestion[] }>(
    'qna/questions.json',
  ).questions

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
          const type = block.type
          if (byType.has(type)) continue
          const blob =
            block.type === 'code'
              ? `${block.code.en} ${block.code.vi}`
              : JSON.stringify(block)
          const token = distinctiveToken(blob)
          if (!token) continue
          byType.set(type, { lang: 'en', query: token, slug: doc.slug })
        }
      }
    }

    const expected = [
      'senior-answer',
      'paragraph',
      'heading',
      'thematic-break',
      'callout',
      'table',
      'list',
      'key-takeaways',
      'code',
    ]
    for (const type of expected) {
      if (type === 'thematic-break') continue
      const probe = byType.get(type)
      expect(probe, `missing searchable text for block type ${type}`).toBeTruthy()
      const hits = searchKnowledgeDocs(docs, probe!.query, probe!.lang, 40)
      expect(
        hits.some((hit) => hit.slug === probe!.slug),
        `${type} query "${probe!.query}" missed slug ${probe!.slug}`,
      ).toBe(true)
    }
  })

  it('matches a few real vi/en queries with and without diacritics', () => {
    const viHits = searchKnowledgeDocs(docs, 'hieu nang', 'vi', 20)
    const viAccent = searchKnowledgeDocs(docs, 'hiệu năng', 'vi', 20)
    expect(viHits.length).toBeGreaterThan(0)
    expect(viAccent.length).toBeGreaterThan(0)

    const enHits = searchKnowledgeDocs(docs, 'event loop', 'en', 20)
    expect(enHits.length).toBeGreaterThan(0)

    const qa = filterInterviewQuestions(questions, {
      query: 'follow',
      lang: 'en',
    })
    const fromExample = questions.find((item) => item.example?.en)
    if (fromExample) {
      const token = distinctiveToken(fromExample.example!.en)
      if (token && splitSearchKeywords(token).length) {
        const hits = filterInterviewQuestions(questions, {
          query: token,
          lang: 'en',
        })
        expect(hits.some((item) => item.id === fromExample.id)).toBe(true)
      }
    }
    expect(Array.isArray(qa)).toBe(true)
  })
})
