import type { ContentBlock, ContentSection, KnowledgeDoc, ListBlock } from '@/modules/content/types'
import { isTocHeadingText } from '@/modules/content/utils/in-content-toc.util'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'
import type { DocLang } from '@/modules/core/constants/locale.constant'
import {
  foldSearchText,
  highlightSnippet,
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
}

const KIND_BASE: Record<KbSearchKind, number> = {
  title: 300,
  heading: 200,
  body: 80,
}

function stripMd(value: string): string {
  return String(value || '')
    .replace(/```([\s\S]*?)```/g, ' $1 ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_>#]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function listPlain(block: ListBlock, lang: string): string[] {
  const out: string[] = []
  for (const item of block.items) {
    const text = pickLocale(item, lang)
    if (text) out.push(stripMd(text))
    if ('children' in item && item.children) {
      out.push(...listPlain(item.children, lang))
    }
  }
  return out
}

function blockPlain(block: ContentBlock, lang: string): string[] {
  switch (block.type) {
    case 'heading':
      return []
    case 'paragraph':
    case 'callout':
    case 'markdown':
      return [stripMd(pickLocale(block.text, lang))]
    case 'senior-answer':
      return [
        stripMd(`${pickLocale(block.label, lang)} ${pickLocale(block.text, lang)}`),
      ]
    case 'code':
      return [pickLocale(block.code, lang)]
    case 'list':
      return listPlain(block, lang)
    case 'table': {
      const cells = [
        ...block.headers.map((cell) => pickLocale(cell, lang)),
        ...block.rows.flatMap((row) => row.map((cell) => pickLocale(cell, lang))),
      ]
      return [stripMd(cells.filter(Boolean).join(' '))]
    }
    case 'key-takeaways':
      return [stripMd(block.items.map((item) => pickLocale(item, lang)).join(' '))]
    default:
      return []
  }
}

function pushRecord(
  records: IndexRecord[],
  record: Omit<IndexRecord, 'folded' | 'text'> & { text: string },
) {
  const text = String(record.text || '').replace(/\s+/g, ' ').trim()
  if (!text) return
  records.push({
    ...record,
    text,
    folded: foldSearchText(text),
  })
}

export function indexKnowledgeDoc(
  doc: KnowledgeDoc,
  lang: DocLang,
): IndexRecord[] {
  const title = pickLocale(doc.title, lang) || doc.slug
  const records: IndexRecord[] = []
  pushRecord(records, {
    slug: doc.slug,
    lang,
    title,
    headingId: '',
    headingTitle: title,
    kind: 'title',
    text: `${title} ${doc.slug} ${doc.category} ${pickLocale(doc.summary, lang)}`,
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

function scoreRecord(query: string, record: IndexRecord): number {
  const q = foldSearchText(query)
  if (!q || q.length < 2) return 0
  const hay = record.folded
  if (!hay) return 0

  let hit = 0
  if (hay === q) hit = 100
  else if (hay.startsWith(q)) hit = 80
  else if (hay.includes(q)) hit = 50 - Math.min(hay.indexOf(q), 30)
  else {
    const words = hay.split(/[\s-]+/).filter(Boolean)
    for (const word of words) {
      if (word.startsWith(q)) {
        hit = 40
        break
      }
    }
    if (!hit && q.length >= 3) {
      for (const word of words) {
        if (word.includes(q)) {
          hit = 20
          break
        }
      }
    }
  }

  if (!hit) return 0
  return KIND_BASE[record.kind] + hit
}

export function searchIndexRecords(
  records: IndexRecord[],
  query: string,
  lang: DocLang,
  limit = 20,
): KbSearchHit[] {
  const q = query.trim()
  if (foldSearchText(q).length < 2) return []

  const best = new Map<string, KbSearchHit>()

  for (const record of records) {
    if (record.lang !== lang) continue
    const score = scoreRecord(q, record)
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
