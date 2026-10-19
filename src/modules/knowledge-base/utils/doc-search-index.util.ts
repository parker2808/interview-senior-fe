import type { KnowledgeCatalog } from '@/modules/content/types'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'
import type { DocLang } from '@/modules/core/constants/locale.constant'
import type { KbSearchHit } from '@/modules/knowledge-base/utils/kb-search-core.util'
import {
  foldSearchText,
  matchesAllKeywords,
  scoreKeywordHay,
  splitSearchKeywords,
} from '@/modules/knowledge-base/utils/search-text.util'

export type { KbSearchHit }
export type DocSearchHit = KbSearchHit

export { foldSearchText as normalizeSearchText }
export {
  highlightSearchText,
  highlightSnippet,
} from '@/modules/knowledge-base/utils/search-text.util'

/**
 * Catalog-only fallback (titles, summaries, catalog headings). Full-text search —
 * titles, headings, body, and code-free block text — lives on GET /api/knowledge-base/search.
 */
export function searchCatalogTitles(
  query: string,
  lang: DocLang,
  catalog: KnowledgeCatalog | null | undefined,
  limit = 20,
): DocSearchHit[] {
  const keywords = splitSearchKeywords(query)
  if (!keywords.length || !catalog) return []

  const hits: DocSearchHit[] = []
  for (const topic of catalog.docs) {
    const title = topic.title[lang]
    const summary = pickLocale(topic.summary, lang)
    const headingText = (topic.headings || [])
      .map((heading) => pickLocale(heading.text, lang))
      .join(' ')
    const hay = foldSearchText(
      `${title} ${topic.slug} ${topic.category} ${summary} ${headingText}`,
    )
    if (!matchesAllKeywords(hay, keywords)) continue

    const titleScore = scoreKeywordHay(foldSearchText(title), keywords)
    const headingScore = scoreKeywordHay(foldSearchText(headingText), keywords)
    const bodyScore = scoreKeywordHay(foldSearchText(summary), keywords)
    const kind: DocSearchHit['kind'] =
      titleScore >= headingScore && titleScore >= bodyScore
        ? 'title'
        : headingScore >= bodyScore
          ? 'heading'
          : 'body'
    const headingHit = (topic.headings || []).find((heading) =>
      matchesAllKeywords(foldSearchText(pickLocale(heading.text, lang)), keywords),
    )
    hits.push({
      id: `${topic.slug}::${headingHit ? pickLocale(headingHit.id, lang) : 'doc'}`,
      slug: topic.slug,
      title,
      headingId: headingHit ? pickLocale(headingHit.id, lang) : '',
      headingTitle: headingHit ? pickLocale(headingHit.text, lang) : title,
      snippet: summary || title,
      score:
        (kind === 'title' ? 350 : kind === 'heading' ? 250 : 120) +
        Math.max(titleScore, headingScore, bodyScore),
      kind,
    })
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit)
}
