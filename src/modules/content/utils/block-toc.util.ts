import type { ContentSection, TocItem } from '@/modules/content/types'
import { isTocHeadingText } from '@/modules/content/utils/in-content-toc.util'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'
import { ensureSectionHeadingIds } from '@/modules/knowledge-base/utils/heading-anchor.util'

export function tocFromSections(
  sections: ContentSection[] | undefined,
  lang: string,
): TocItem[] {
  const toc: TocItem[] = []
  const prepared = ensureSectionHeadingIds(sections, lang)

  for (const section of prepared) {
    for (const block of section.blocks) {
      if (block.type !== 'heading') continue
      if (block.level < 2) continue
      const text = pickLocale(block.text, lang)
      if (isTocHeadingText(text)) continue
      toc.push({
        id: pickLocale(block.id, lang) || '',
        text,
        level: block.level,
      })
    }
  }

  return toc.filter((item) => item.id && item.text)
}
