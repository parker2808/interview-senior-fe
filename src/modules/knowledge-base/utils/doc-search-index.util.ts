import type { KnowledgeCatalog } from '@/modules/content/types'
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

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildIndex(catalog: KnowledgeCatalog | null | undefined): IndexEntry[] {
  const entries: IndexEntry[] = []
  if (!catalog) return entries

  for (const topic of catalog.docs) {
    for (const lang of ['vi', 'en'] as DocLang[]) {
      const topicTitle = topic.title[lang]
      entries.push({
        slug: topic.slug,
        lang,
        topicTitle,
        heading: topicTitle,
        headingId: '',
        level: 0,
        haystack: normalize(`${topicTitle} ${topic.slug} ${topic.category}`),
      })
      for (const heading of topic.headings) {
        entries.push({
          slug: topic.slug,
          lang,
          topicTitle,
          heading: heading.text[lang],
          headingId: heading.id[lang],
          level: heading.level,
          haystack: normalize(
            `${heading.text[lang]} ${topicTitle} ${topic.slug}`,
          ),
        })
      }
    }
  }
  return entries
}

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

  const words = h.split(/[\s/-]+/).filter(Boolean)
  for (const w of words) {
    if (w.startsWith(q)) return 150
  }

  if (q.length >= 3) {
    for (const w of words) {
      if (w.length >= q.length && w[0] === q[0] && subsequenceMatch(q, w)) {
        return 90
      }
    }
  }

  return 0
}

export function searchDocs(
  query: string,
  lang: DocLang,
  catalog: KnowledgeCatalog | null | undefined,
  limit = 40,
): DocSearchHit[] {
  const q = query.trim()
  const index = buildIndex(catalog).filter((e) => e.lang === lang)

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
