import { describe, expect, it } from 'vitest'
import { buildFdeIndex, searchFde, snippetHtml } from '../src/modules/fde/utils/fde-search.util'
import type { FdeEntry } from '../src/modules/fde/types/entities/fde-content.type'

const makeEntry = (id: string, title: string, body: string): FdeEntry => ({
  id, section: 'concepts', jdRequirement: 'writeback', tags: ['allow-list'],
  title: { en: title, vi: title }, shortAnswer: { en: body, vi: body },
  keyPoints: [{ en: body, vi: body }], detail: { en: body, vi: body },
})

describe('FDE search', () => {
  const index = buildFdeIndex([
    makeEntry('title', 'Ghi ngược có kiểm soát', 'Một cổng duy nhất.'),
    makeEntry('body', 'Audit service', 'Ghi ngược ở phần giải thích.'),
    makeEntry('other', 'Mailbox', '<script>alert(1)</script>'),
  ])

  it('folds accents and ranks titles before body', () => {
    expect(searchFde(index, 'ghi nguoc').map((hit) => hit.entry.id).slice(0, 2)).toEqual(['title', 'body'])
  })

  it('expands write-back and allow-list synonyms', () => {
    expect(searchFde(index, 'write-back')[0].entry.id).toBe('title')
    expect(searchFde(index, 'allow list').length).toBeGreaterThan(0)
  })

  it('matches one-character typos, but not unrelated words', () => {
    expect(searchFde(index, 'mailbax')[0].entry.id).toBe('other')
    expect(searchFde(index, 'completely unrelated')).toEqual([])
  })

  it('escapes snippets before highlighting', () => {
    const hit = searchFde(index, 'script')[0]
    expect(snippetHtml(hit)).not.toContain('<script>')
    expect(snippetHtml(hit)).toContain('&lt;')
  })
})
