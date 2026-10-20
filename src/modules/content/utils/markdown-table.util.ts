const TABLE_RE = /<table\b[^>]*>[\s\S]*?<\/table>/gi
const WRAP_BEFORE_RE = /<div class="prose-table-wrap">\s*$/i

function stripTags(html: string) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeAttr(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .slice(0, 160)
}

function headerLabels(tableHtml: string): string[] {
  const thead = tableHtml.match(/<thead\b[^>]*>[\s\S]*?<\/thead>/i)?.[0] || ''
  const source =
    thead || tableHtml.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/i)?.[0] || ''
  return [...source.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/gi)].map((match) =>
    escapeAttr(stripTags(match[1])),
  )
}

/** Add `data-label` from column headers so mobile stacked cards can show them. */
export function annotateMarkdownTableCells(tableHtml: string): string {
  const headers = headerLabels(tableHtml)
  if (!headers.length) return tableHtml
  return tableHtml.replace(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi, (row) => {
    if (/<th\b/i.test(row)) return row
    let index = 0
    return row.replace(/<td\b([^>]*)>/gi, (full, attrs: string) => {
      const label = headers[index] || ''
      index += 1
      if (/\sdata-label\s*=/i.test(attrs)) return full
      return `<td${attrs} data-label="${label}">`
    })
  })
}

/**
 * Wrap every HTML table in a horizontal scroller and stamp header labels on cells.
 * Safe to run more than once.
 */
export function wrapMarkdownTables(html: string): string {
  const source = String(html || '')
  return source.replace(TABLE_RE, (table, offset: number) => {
    const annotated = annotateMarkdownTableCells(table)
    const before = source.slice(Math.max(0, offset - 48), offset)
    if (WRAP_BEFORE_RE.test(before)) return annotated
    return `<div class="prose-table-wrap">${annotated}</div>`
  })
}
