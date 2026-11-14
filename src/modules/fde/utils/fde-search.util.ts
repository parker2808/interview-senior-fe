import { foldSearchText, highlightSnippet, matchesAllKeywords, scoreKeywordHay, splitSearchKeywords } from '@/modules/knowledge-base/utils/search-text.util'
import type { FdeEntry } from '@/modules/fde/types/entities/fde-content.type'

const SYNONYMS = [
  ['write-back', 'write back', 'ghi nguoc', 'allow list', 'allow-list', 'danh sach cho phep'],
  ['gmail', 'email', 'mailbox', 'hop thu'],
  ['idempotency', 'dedupe', 'chong trung', 'khong trung lap'],
  ['grant milestone', 'milestone', 'moc tai tro'],
]

type SearchRecord = {
  entry: FdeEntry
  fields: { text: string; folded: string; weight: number; lang: 'en' | 'vi' }[]
  all: string
  fuzzyHay: string
}

export type FdeSearchHit = { entry: FdeEntry; score: number; snippet: string; matchedLang: 'en' | 'vi'; matchTerm: string }

export function buildFdeIndex(entries: FdeEntry[]): SearchRecord[] {
  return entries.map((entry) => {
    const fields: SearchRecord['fields'] = []
    for (const lang of ['en', 'vi'] as const) {
      for (const [text, weight] of [
        [entry.title[lang], 500],
        [entry.tags.join(' '), 360],
        [entry.shortAnswer[lang], 240],
        [entry.keyPoints.map((point) => point[lang]).join(' '), 130],
        [entry.detail[lang], 55],
      ] as [string, number][]) fields.push({ text, folded: foldSearchText(text), weight, lang })
    }
    return { entry, fields, all: fields.map((field) => field.folded).join(' '), fuzzyHay: fields.filter((field) => field.weight >= 240).map((field) => field.folded).join(' ') }
  })
}

function nearMatch(text: string, token: string): boolean {
  if (token.length < 4) return false
  return text.split(/\s+/).some((word) => {
    if (Math.abs(word.length - token.length) > 1) return false
    let row = Array.from({ length: token.length + 1 }, (_, index) => index)
    for (let index = 1; index <= word.length; index++) {
      const next = [index]
      for (let offset = 1; offset <= token.length; offset++) {
        next.push(Math.min(next[offset - 1] + 1, row[offset] + 1, row[offset - 1] + (word[index - 1] === token[offset - 1] ? 0 : 1)))
      }
      row = next
    }
    return row[token.length] <= 1
  })
}

function variants(query: string): string[] {
  const normalized = foldSearchText(query)
  if (!normalized) return []
  const group = SYNONYMS.find((aliases) => aliases.some((alias) => foldSearchText(alias) === normalized))
  return group ? [normalized, ...group.map(foldSearchText).filter((alias) => alias !== normalized)] : [normalized]
}

export function searchFde(index: SearchRecord[], query: string): FdeSearchHit[] {
  const queries = variants(query)
  if (!queries.length) return index.map(({ entry }) => ({ entry, score: 0, snippet: '', matchedLang: 'en', matchTerm: '' }))
  const results: FdeSearchHit[] = []
  for (const record of index) {
    let best: FdeSearchHit | null = null
    for (const variant of queries) {
      const keywords = splitSearchKeywords(variant)
      if (!keywords.length) continue
      const fuzzy = keywords.every((token) => record.all.includes(token) || nearMatch(record.fuzzyHay, token))
      if (!fuzzy) continue
      for (const field of record.fields) {
        const exact = matchesAllKeywords(field.folded, keywords)
        const score = exact ? field.weight + scoreKeywordHay(field.folded, keywords) : (fuzzy ? 12 : 0)
        if (!score || (best && best.score >= score)) continue
        best = {
          entry: record.entry, score,
          snippet: field.weight === 360 ? record.entry.shortAnswer[field.lang] : field.text,
          matchedLang: field.lang, matchTerm: variant,
        }
      }
    }
    if (best) results.push(best)
  }
  return results.sort((first, second) => second.score - first.score || first.entry.id.localeCompare(second.entry.id))
}

export function snippetHtml(hit: FdeSearchHit): string {
  return highlightSnippet(hit.snippet, hit.matchTerm, 170)
}
