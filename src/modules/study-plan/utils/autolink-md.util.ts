/**
 * Turn bare `*.md` code spans (not already inside anchors) into clickable links.
 */
export function autolinkMarkdownPaths(html: string, _fromPath: string): string {
  return html.replace(
    /(<code>)([^<]*?\.md(?:#[^<]*)?)(<\/code>)/gi,
    (full, open: string, raw: string, close: string, offset: number, whole: string) => {
      const path = raw.trim()
      if (!path || path.includes('*') || /\s/.test(path)) return full
      const before = whole.slice(Math.max(0, offset - 160), offset)
      if (/<a\b[^>]*>[^<]*$/i.test(before) || /<a\b[^>]*$/i.test(before)) {
        return full
      }
      const href = toContentHref(path)
      return `<a href="${href}">${open}${raw}${close}</a>`
    },
  )
}

/** Emit hrefs that `classifyMarkdownHref` treats as content-root paths. */
function toContentHref(pathWithHash: string): string {
  const [pathPart, hash] = pathWithHash.split('#')
  let cleaned = pathPart.replace(/^\.\//, '')

  if (cleaned.startsWith('../')) {
    // keep relative; classifier will resolve
  } else if (cleaned.startsWith('capstone/')) {
    cleaned = `artifacts/${cleaned}`
  } else if (/^\d{2}-[a-z0-9-]+\.md$/i.test(cleaned)) {
    cleaned = `artifacts/capstone/${cleaned}`
  }

  return hash ? `${cleaned}#${hash}` : cleaned
}
