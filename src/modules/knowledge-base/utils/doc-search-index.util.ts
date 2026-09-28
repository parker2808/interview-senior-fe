import { marked } from 'marked'
import { FLAT_TOPICS } from '@/modules/knowledge-base/constants/doc-catalog.constant'
import {
  kbPath,
  loadKbMarkdown,
} from '@/modules/knowledge-base/utils/load-kb-markdown.util'
import { enhanceMarkdownHtml } from '@/modules/knowledge-base/utils/toc.util'
import type { DocLang } from '@/modules/core/constants/locale.constant'

export type DocSearchHit = {
  id: string
  slug: string
  lang: DocLang
  topicTitle: string
  heading: string
  headingId: string
  level: number
  score: number
}

type IndexEntry = {
  slug: string
  lang: DocLang
  topicTitle: string
  heading: string
  headingId: string
  level: number
  haystack: string
}

let cached: IndexEntry[] | null = null

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

/** Pull headings + ids from the same HTML pipeline the reader uses. */
function extractIndexedHeadings(
  md: string,
): Array<{ level: number; text: string; id: string }> {
  const rawHtml = marked.parse(md, { async: false }) as string
  const { html } = enhanceMarkdownHtml(rawHtml)
  const out: Array<{ level: number; text: string; id: string }> = []
  const re = /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    const level = Number(m[1])
    const attrs = m[2]
    const inner = m[3]
    const id = attrs.match(/\sid=["']([^"']+)["']/i)?.[1]
    const text = decodeEntities(inner.replace(/<[^>]+>/g, '')).trim()
    if (!id || !text) continue
    if (text === 'Table of Contents' || text === 'Mục lục') continue
    out.push({ level, text, id })
  }
  return out
}

function buildIndex(): IndexEntry[] {
  if (cached) return cached
  const entries: IndexEntry[] = []

  for (const topic of FLAT_TOPICS) {
    for (const lang of ['vi', 'en'] as DocLang[]) {
      const loaded = loadKbMarkdown(kbPath(lang, topic.slug))
      if (!loaded.ok) continue

      const topicTitle = topic.title[lang]
      entries.push({
        slug: topic.slug,
        lang,
        topicTitle,
        heading: topicTitle,
        headingId: '',
        level: 0,
        haystack: normalize(`${topicTitle} ${topic.slug} ${topic.group}`),
      })

      for (const h of extractIndexedHeadings(loaded.text)) {
        entries.push({
          slug: topic.slug,
          lang,
          topicTitle,
          heading: h.text,
          headingId: h.id,
          level: h.level,
          haystack: normalize(`${h.text} ${topicTitle} ${topic.slug}`),
        })
      }
    }
  }

  cached = entries
  return entries
}

/** Subsequence fuzzy: "hois" matches "hoisting". */
function subsequenceMatch(query: string, text: string): boolean {
  let qi = 0
  for (let i = 0; i < text.length && qi < query.length; i++) {
    if (text[i] === query[qi]) qi++
  }
  return qi === query.length
}

function scoreEntry(query: string, entry: IndexEntry): number {
  const q = normalize(query)
  if (!q || q.length < 2) return 0
  const h = normalize(entry.heading)
  const hay = entry.haystack

  if (h === q) return 200
  if (h.startsWith(q)) return 180
  if (h.includes(q)) return 160 - Math.min(h.indexOf(q), 40)
  if (hay.includes(q)) return 120

  // word prefix (hois → hoisting)
  const words = h.split(/[\s/-]+/)
  for (const w of words) {
    if (w.startsWith(q)) return 150
  }

  if (q.length >= 3 && subsequenceMatch(q, h)) return 90
  if (q.length >= 3 && subsequenceMatch(q, hay)) return 70

  return 0
}

export function searchDocs(
  query: string,
  lang: DocLang,
  limit = 40,
): DocSearchHit[] {
  const q = query.trim()
  const index = buildIndex().filter((e) => e.lang === lang)

  if (!q) {
    return index
      .filter((e) => e.level === 0)
      .slice(0, limit)
      .map((e, i) => ({
        id: `${e.slug}-topic-${i}`,
        slug: e.slug,
        lang: e.lang,
        topicTitle: e.topicTitle,
        heading: e.heading,
        headingId: e.headingId,
        level: e.level,
        score: 0,
      }))
  }

  const hits: DocSearchHit[] = []
  for (const e of index) {
    const score = scoreEntry(q, e)
    if (score <= 0) continue
    hits.push({
      id: `${e.slug}:${e.headingId || 'topic'}:${e.level}`,
      slug: e.slug,
      lang: e.lang,
      topicTitle: e.topicTitle,
      heading: e.heading,
      headingId: e.headingId,
      level: e.level,
      score,
    })
  }

  hits.sort((a, b) => b.score - a.score || a.heading.localeCompare(b.heading))
  return hits.slice(0, limit)
}
