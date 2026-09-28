import type { TocItem } from '@/modules/knowledge-base/types/entities/doc.type'

/** Extract H2/H3 headings and ensure ids on the HTML for TOC / scroll-spy. */
export function enhanceMarkdownHtml(html: string): {
  html: string
  toc: TocItem[]
} {
  const toc: TocItem[] = []
  const used = new Set<string>()

  const nextId = (text: string) => {
    const base = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 64) || 'section'
    let id = base
    let n = 2
    while (used.has(id)) {
      id = `${base}-${n++}`
    }
    used.add(id)
    return id
  }

  const enhanced = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_full, levelStr: string, attrs: string, inner: string) => {
      const level = Number(levelStr) as 2 | 3
      const text = inner.replace(/<[^>]+>/g, '').trim()
      const existing = attrs.match(/\sid=["']([^"']+)["']/i)?.[1]
      const id = existing || nextId(text)
      const cleanAttrs = attrs.replace(/\sid=["'][^"']*["']/i, '')
      toc.push({ id, text, level })
      return `<h${level}${cleanAttrs} id="${id}">${inner}</h${level}>`
    },
  )

  return { html: enhanced, toc }
}
