import type { KnowledgeCatalog } from '@/modules/content/types'
import type { DocLang } from '@/modules/core/constants/locale.constant'
import type { KbSearchHit } from '@/modules/knowledge-base/utils/kb-search-core.util'
import { foldSearchText } from '@/modules/knowledge-base/utils/search-text.util'

export type { KbSearchHit }
export type DocSearchHit = KbSearchHit

export { foldSearchText as normalizeSearchText }
export {
  highlightSearchText,
  highlightSnippet,
} from '@/modules/knowledge-base/utils/search-text.util'

/**
 * Catalog-only fallback (titles + catalog headings). Full-text search —
 * titles, headings, body, and code — lives on GET /api/knowledge-base/search.
 */
export function searchCatalogTitles(
  query: string,
  lang: DocLang,
  catalog: KnowledgeCatalog | null | undefined,
  limit = 20,
): DocSearchHit[] {
  const q = foldSearchText(query)
  if (!q || q.length < 2 || !catalog) return []

  const hits: DocSearchHit[] = []
  for (const topic of catalog.docs) {
    const title = topic.title[lang]
    const hay = foldSearchText(`${title} ${topic.slug} ${topic.category}`)
    if (!hay.includes(q) && !hay.startsWith(q)) continue
    hits.push({
      id: `${topic.slug}::doc`,
      slug: topic.slug,
      title,
      headingId: '',
      headingTitle: title,
      snippet: title,
      score: hay === q ? 400 : hay.startsWith(q) ? 380 : 350,
      kind: 'title',
    })
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit)
}
