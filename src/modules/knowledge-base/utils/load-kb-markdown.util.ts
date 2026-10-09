const kbModules = import.meta.glob('@kb/**/*.md', {
  import: 'default',
  eager: true,
})

function toKbPath(key: string): string {
  const marker = '/documents/'
  const idx = key.indexOf(marker)
  if (idx === -1) return key.replace(/^\.?\/+/, '')
  return `documents/${key.slice(idx + marker.length)}`
}

const byPath: Record<string, string> = Object.fromEntries(
  Object.entries(kbModules).map(([key, content]) => [
    toKbPath(key),
    content as string,
  ]),
)

export function loadKbMarkdown(relativePath: string) {
  const normalized = String(relativePath || '')
    .replace(/^\.?\/+/, '')
    .replace(/^\/+/, '')
  const content = byPath[normalized]
  if (typeof content !== 'string') {
    return {
      ok: false as const,
      path: normalized,
      text: `_File not found: \`${normalized}\`_`,
    }
  }
  return { ok: true as const, path: normalized, text: content }
}

export function kbPath(lang: string, slug: string) {
  return `documents/${lang}/${slug}.md`
}

export function isKbPath(path: string) {
  return loadKbMarkdown(path).ok
}

export function listKbPaths() {
  return Object.keys(byPath).sort()
}
