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

function queryGroups(query: string): string[][][] {
  const tokens = foldSearchText(query).split(' ').filter(Boolean)
  const aliases = SYNONYMS.flatMap((group) => group.map((alias) => ({
    tokens: foldSearchText(alias).split(' '),
    alternatives: group.map(splitSearchKeywords),
  }))).sort((first, second) => second.tokens.length - first.tokens.length)
  const groups: string[][][] = []
  for (let offset = 0; offset < tokens.length;) {
    const alias = aliases.find((item) => item.tokens.every((token, index) => tokens[offset + index] === token))
    if (alias) {
      groups.push(alias.alternatives)
      offset += alias.tokens.length
    } else {
      const keywords = splitSearchKeywords(tokens[offset])
      if (keywords.length) groups.push([keywords])
      offset++
    }
  }
  return groups
}

export function searchFde(index: SearchRecord[], query: string): FdeSearchHit[] {
  const groups = queryGroups(query)
  if (!groups.length) return index.map(({ entry }) => ({ entry, score: 0, snippet: '', matchedLang: 'en', matchTerm: '' }))
  const results: FdeSearchHit[] = []
  for (const record of index) {
    let best: FdeSearchHit | null = null
    const matches = groups.every((alternatives) => alternatives.some((keywords) =>
      keywords.every((token) => record.all.includes(token) || nearMatch(record.fuzzyHay, token)),
    ))
    if (!matches) continue
    for (const field of record.fields) {
      const choices = groups.map((alternatives) => alternatives
        .filter((keywords) => matchesAllKeywords(field.folded, keywords))
        .sort((first, second) => scoreKeywordHay(field.folded, second) - scoreKeywordHay(field.folded, first))[0])
      const exact = choices.every(Boolean)
      const keywords = choices.flatMap((choice) => choice || [])
      const score = exact ? field.weight + scoreKeywordHay(field.folded, keywords) : 12
      if (best && best.score >= score) continue
      best = {
        entry: record.entry, score,
        snippet: field.weight === 360 ? record.entry.shortAnswer[field.lang] : field.text,
        matchedLang: field.lang, matchTerm: keywords.join(' ') || query,
      }
    }
    if (best) results.push(best)
  }
  return results.sort((first, second) => second.score - first.score || first.entry.id.localeCompare(second.entry.id))
}

export function snippetHtml(hit: FdeSearchHit): string {
  return highlightSnippet(hit.snippet, hit.matchTerm, 170)
}
