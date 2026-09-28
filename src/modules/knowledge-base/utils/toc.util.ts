import type { TocItem } from '@/modules/knowledge-base/types/entities/doc.type'

/**
 * GitHub-flavored heading id (matches README / in-doc ToC anchors
 * like `#211-interface-vs-type` from "2.1.1. Interface vs Type").
 */
export function slugifyHeading(text: string): string {
  return (
    text
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

/** Extract headings and ensure ids on H1–H6 for TOC / in-doc hash links. */
export function enhanceMarkdownHtml(html: string): {
  html: string
  toc: TocItem[]
} {
  const toc: TocItem[] = []
  const used = new Set<string>()

  const nextId = (text: string) => {
    const base = slugifyHeading(text)
    let id = base
    let n = 2
    while (used.has(id)) {
      id = `${base}-${n++}`
    }
    used.add(id)
    return id
  }

  const enhanced = html.replace(
    /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_full, levelStr: string, attrs: string, inner: string) => {
      const level = Number(levelStr)
      const text = inner.replace(/<[^>]+>/g, '').trim()
      const existing = attrs.match(/\sid=["']([^"']+)["']/i)?.[1]
      const id = existing || nextId(text)
      const cleanAttrs = attrs.replace(/\sid=["'][^"']*["']/i, '')
      if (level === 2 || level === 3) {
        toc.push({ id, text, level: level as 2 | 3 })
      }
      return `<h${level}${cleanAttrs} id="${id}">${inner}</h${level}>`
    },
  )

  return { html: enhanced, toc }
}
