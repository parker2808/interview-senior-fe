const planModules = import.meta.glob('@plan/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const kbModules = import.meta.glob('@kb/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function toPlanPath(key: string): string {
  const marker = '/content/'
  const idx = key.indexOf(marker)
  if (idx === -1) return key.replace(/^\.?\/+/, '')
  return key.slice(idx + marker.length)
}

function toKbPath(key: string): string {
  const marker = '/documents/'
  const idx = key.indexOf(marker)
  if (idx === -1) return key.replace(/^\.?\/+/, '')
  return `documents/${key.slice(idx + marker.length)}`
}

const byPath: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(planModules).map(([key, content]) => [
      toPlanPath(key),
      content as string,
    ]),
  ),
  ...Object.fromEntries(
    Object.entries(kbModules).map(([key, content]) => [
      toKbPath(key),
      content as string,
    ]),
  ),
}

export function loadMarkdown(relativePath: string) {
  const normalized = String(relativePath || '')
    .replace(/^\.?\/+/, '')
    .replace(/^\/+/, '')
  const content = byPath[normalized]
  if (typeof content !== 'string') {
    return {
      ok: false as const,
      path: normalized,
      text: `_Không tìm thấy file: \`${normalized}\`_`,
    }
  }
  return { ok: true as const, path: normalized, text: content }
}

export function isBundledPath(relativePath: string) {
  return loadMarkdown(relativePath).ok
}
