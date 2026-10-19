import type { ContentBlock, ContentSection, KnowledgeDoc, Localized } from '@/modules/content/types'
import { isTocHeadingText } from '@/modules/content/utils/in-content-toc.util'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'
import type { DocLang } from '@/modules/core/constants/locale.constant'
import {
  foldSearchText,
  highlightSnippet,
  matchesAllKeywords,
  scoreKeywordHay,
  splitSearchKeywords,
} from '@/modules/knowledge-base/utils/search-text.util'

export type KbSearchKind = 'title' | 'heading' | 'body'

export type KbSearchHit = {
  id: string
  slug: string
  title: string
  headingId: string
  headingTitle: string
  snippet: string
  score: number
  kind: KbSearchKind
}

type IndexRecord = {
  slug: string
  lang: DocLang
  title: string
  headingId: string
  headingTitle: string
  kind: KbSearchKind
  text: string
  folded: string
  foldedContext: string
  foldedTitle: string
  foldedHeading: string
}

const KIND_BASE: Record<KbSearchKind, number> = {
  title: 300,
  heading: 200,
  body: 80,
}

const SKIP_PLAIN_KEYS = new Set([
  'id',
  'type',
  'style',
  'kind',
  'align',
  'level',
  'lang',
  'order',
  'category',
  'slug',
  'tags',
])

function stripMd(value: string): string {
  return String(value || '')
    .replace(/```([\s\S]*?)```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_>#]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isLocalized(value: unknown): value is Localized {
  if (!value || typeof value !== 'object') return false
  const rec = value as Record<string, unknown>
  return typeof rec.en === 'string' && typeof rec.vi === 'string'
}

function walkPlain(value: unknown, lang: string, out: string[]): void {
  if (value == null) return
  if (typeof value === 'string') {
    const text = stripMd(value)
    if (text) out.push(text)
    return
  }
  if (Array.isArray(value)) {
    for (const item of value) walkPlain(item, lang, out)
    return
  }
  if (typeof value !== 'object') return

  if (isLocalized(value)) {
    const text = stripMd(pickLocale(value, lang))
    if (text) out.push(text)
    for (const [key, child] of Object.entries(value)) {
      if (key === 'en' || key === 'vi' || SKIP_PLAIN_KEYS.has(key)) continue
      walkPlain(child, lang, out)
    }
    return
  }

  const rec = value as Record<string, unknown>
  if (rec.type === 'heading') return

  for (const [key, child] of Object.entries(rec)) {
    if (SKIP_PLAIN_KEYS.has(key)) continue
    if (key === 'code') {
      const code = isLocalized(child) ? pickLocale(child, lang) : String(child || '')
      if (code.trim()) out.push(code.replace(/\s+/g, ' ').trim())
      continue
    }
    walkPlain(child, lang, out)
  }
}

function blockPlain(block: ContentBlock, lang: string): string[] {
  const out: string[] = []
  walkPlain(block, lang, out)
  return out
}

function pushRecord(
  records: IndexRecord[],
  record: Omit<IndexRecord, 'folded' | 'foldedContext' | 'foldedTitle' | 'foldedHeading' | 'text'> & {
    text: string
  },
) {
  const text = String(record.text || '').replace(/\s+/g, ' ').trim()
  if (!text) return
  const folded = foldSearchText(text)
  const foldedTitle = foldSearchText(record.title)
  const foldedHeading = foldSearchText(record.headingTitle)
  records.push({
    ...record,
    text,
    folded,
    foldedTitle,
    foldedHeading,
    foldedContext: foldSearchText(`${record.title} ${record.headingTitle} ${text}`),
  })
}

export function indexKnowledgeDoc(
  doc: KnowledgeDoc,
  lang: DocLang,
): IndexRecord[] {
  const title = pickLocale(doc.title, lang) || doc.slug
  const records: IndexRecord[] = []
  const tags = Array.isArray(doc.tags) ? doc.tags.join(' ') : ''
  pushRecord(records, {
    slug: doc.slug,
    lang,
    title,
    headingId: '',
    headingTitle: title,
    kind: 'title',
    text: `${title} ${doc.slug} ${doc.category} ${tags} ${pickLocale(doc.summary, lang)}`,
  })

  let headingId = ''
  let headingTitle = title
  let bodyParts: string[] = []

  const flushBody = () => {
    if (!bodyParts.length) return
    pushRecord(records, {
      slug: doc.slug,
      lang,
      title,
      headingId,
      headingTitle,
      kind: 'body',
      text: bodyParts.join(' '),
    })
    bodyParts = []
  }

  const visitSections = (sections: ContentSection[]) => {
    for (const section of sections) {
      const sectionTitle = pickLocale(section.title, lang)
      if (
        isTocHeadingText(sectionTitle) ||
        isTocHeadingText(section.title.en) ||
        isTocHeadingText(section.title.vi)
      ) {
        continue
      }
      if (sectionTitle && sectionTitle !== headingTitle && sectionTitle !== title) {
        bodyParts.push(sectionTitle)
      }
      for (const block of section.blocks) {
        if (block.type === 'heading') {
          const text = pickLocale(block.text, lang)
          if (isTocHeadingText(text)) continue
          flushBody()
          headingId = pickLocale(block.id, lang) || ''
          headingTitle = text || title
          if (block.level >= 2) {
            pushRecord(records, {
              slug: doc.slug,
              lang,
              title,
              headingId,
              headingTitle,
              kind: 'heading',
              text: headingTitle,
            })
          }
          continue
        }
        bodyParts.push(...blockPlain(block, lang))
      }
    }
  }

  visitSections(doc.sections)
  flushBody()
  return records
}

function scoreRecord(keywords: string[], record: IndexRecord): number {
  if (!keywords.length) return 0
  if (!matchesAllKeywords(record.foldedContext, keywords)) return 0

  const own = scoreKeywordHay(record.folded, keywords)
  const titleOwn = scoreKeywordHay(record.foldedTitle, keywords)
  if (!own && record.kind !== 'title') return 0

  if (record.kind === 'title') {
    const base = titleOwn > 0 ? KIND_BASE.title : 90
    return base + (titleOwn || own)
  }

  const headingBonus = Math.round(
    scoreKeywordHay(record.foldedHeading, keywords) * 0.25,
  )
  const titleBonus = Math.round(titleOwn * 0.15)
  return KIND_BASE[record.kind] + own + headingBonus + titleBonus
}

export function searchIndexRecords(
  records: IndexRecord[],
  query: string,
  lang: DocLang,
  limit = 20,
): KbSearchHit[] {
  const q = query.trim()
  const keywords = splitSearchKeywords(q)
  if (!keywords.length) return []

  const best = new Map<string, KbSearchHit>()

  for (const record of records) {
    if (record.lang !== lang) continue
    const score = scoreRecord(keywords, record)
    if (score <= 0) continue
    const key = `${record.slug}::${record.headingId || 'doc'}`
    const current = best.get(key)
    if (current && current.score >= score) continue
    best.set(key, {
      id: key,
      slug: record.slug,
      title: record.title,
      headingId: record.headingId,
      headingTitle: record.headingTitle,
      snippet: highlightSnippet(record.text, q),
      score,
      kind: record.kind,
    })
  }

  return [...best.values()]
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.title.localeCompare(b.title) ||
        a.headingTitle.localeCompare(b.headingTitle),
    )
    .slice(0, limit)
}

export function searchKnowledgeDocs(
  docs: KnowledgeDoc[],
  query: string,
  lang: DocLang,
  limit = 20,
): KbSearchHit[] {
  const records = docs.flatMap((doc) => indexKnowledgeDoc(doc, lang))
  return searchIndexRecords(records, query, lang, limit)
}
