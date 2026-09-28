const planModules = import.meta.glob('@plan/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const kbModules = import.meta.glob('@kb/{en,vi}/**/*.md', {
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
  const content = byPath[relativePath]
  if (typeof content !== 'string') {
    return {
      ok: false,
      path: relativePath,
      text: `_Không tìm thấy file: \`${relativePath}\`_`,
    }
  }
  return { ok: true, path: relativePath, text: content }
}

export function listLoadedPaths() {
  return Object.keys(byPath).sort()
}
