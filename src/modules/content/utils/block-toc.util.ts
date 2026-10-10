import type { ContentSection, TocItem } from '@/modules/content/types'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'

export function tocFromSections(
  sections: ContentSection[] | undefined,
  lang: string,
): TocItem[] {
  const toc: TocItem[] = []
  for (const section of sections || []) {
    for (const block of section.blocks) {
      if (block.type !== 'heading') continue
      if (block.level !== 2 && block.level !== 3) continue
      const text = pickLocale(block.text, lang)
      if (/^(table of contents|mục lục)$/i.test(text)) continue
      toc.push({
        id: pickLocale(block.id, lang) || '',
        text,
        level: block.level,
      })
    }
  }
  return toc.filter((item) => item.id && item.text)
}
