const planModules = import.meta.glob('@plan/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// Entire shared KB under documents/ (en/, vi/, README) — single canonical tree
const kbModules = import.meta.glob('@kb/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

/** Normalize glob keys to plan-relative paths like `day-01-starter.md` */
function toPlanPath(key) {
  const marker = '/content/'
  const idx = key.indexOf(marker)
  if (idx === -1) return key.replace(/^\.?\/+/, '')
  return key.slice(idx + marker.length)
}

/** Normalize KB glob keys to repo-root paths like `documents/vi/vue3.md` */
function toKbPath(key) {
  const marker = '/documents/'
  const idx = key.indexOf(marker)
  if (idx === -1) return key.replace(/^\.?\/+/, '')
  return `documents/${key.slice(idx + marker.length)}`
}

const byPath = {
  ...Object.fromEntries(
    Object.entries(planModules).map(([key, content]) => [toPlanPath(key), content]),
  ),
  ...Object.fromEntries(
    Object.entries(kbModules).map(([key, content]) => [toKbPath(key), content]),
  ),
}

export function loadMarkdown(relativePath) {
  const normalized = String(relativePath || '')
    .replace(/^\.?\/+/, '')
    .replace(/^\/+/, '')
  const content = byPath[normalized]
  if (typeof content !== 'string') {
    return {
      ok: false,
      path: normalized,
      text: `_Không tìm thấy file: \`${normalized}\`_`,
    }
  }
  return { ok: true, path: normalized, text: content }
}

export function listLoadedPaths() {
  return Object.keys(byPath).sort()
}

export function isBundledPath(relativePath) {
  return loadMarkdown(relativePath).ok
}
