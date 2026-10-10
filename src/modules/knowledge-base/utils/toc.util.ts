import type { TocItem } from '@/modules/knowledge-base/types/entities/doc.type'
import {
  nextHeadingId,
  slugifyHeading,
} from '@/modules/knowledge-base/utils/heading-anchor.util'

export { slugifyHeading }

function decodeBasicEntities(s: string) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

/** Extract headings and ensure ids on H1–H6 for TOC / in-doc hash links. */
export function enhanceMarkdownHtml(html: string): {
  html: string
  toc: TocItem[]
} {
  const toc: TocItem[] = []
  const used = new Set<string>()

  const enhanced = html.replace(
    /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_full, levelStr: string, attrs: string, inner: string) => {
      const level = Number(levelStr)
      const text = decodeBasicEntities(inner.replace(/<[^>]+>/g, '')).trim()
      const existing = attrs.match(/\sid=["']([^"']+)["']/i)?.[1]
      const id = existing || nextHeadingId(text, used)
      if (existing) used.add(existing)
      const cleanAttrs = attrs.replace(/\sid=["'][^"']*["']/i, '')
      if (level >= 2) {
        toc.push({ id, text, level })
      }
      return `<h${level}${cleanAttrs} id="${id}">${inner}</h${level}>`
    },
  )

  return { html: enhanced, toc }
}
