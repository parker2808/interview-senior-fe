import type { ContentSection, LocaleCode } from '@/modules/content/types'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'

/** GitHub-flavored heading id (matches in-doc ToC anchors). */
export function slugifyHeading(text: string): string {
  return (
    String(text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80) || 'section'
  )
}

export function nextHeadingId(text: string, used: Set<string>): string {
  const base = slugifyHeading(text)
  let id = base
  let n = 2
  while (used.has(id)) {
    id = `${base}-${n++}`
  }
  used.add(id)
  return id
}

/** Fill missing heading ids for the active locale so TOC links and renderer match. */
export function ensureSectionHeadingIds(
  sections: ContentSection[] | undefined,
  lang: string,
): ContentSection[] {
  const used = new Set<string>()
  const locale: LocaleCode = lang === 'en' ? 'en' : 'vi'

  return (sections || []).map((section) => ({
    ...section,
    blocks: section.blocks.map((block) => {
      if (block.type !== 'heading') return block
      const existing = String(pickLocale(block.id, lang) || '').trim()
      if (existing) {
        used.add(existing)
        return block
      }
      const id = nextHeadingId(pickLocale(block.text, lang), used)
      return {
        ...block,
        id: { ...block.id, [locale]: id },
      }
    }),
  }))
}
