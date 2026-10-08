const planModules = import.meta.glob('@plan/**/*.md', {
  import: 'default',
  eager: true,
})

const kbModules = import.meta.glob('@kb/**/*.md', {
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

function normalizedLocale(locale?: string) {
  return locale === 'en' ? 'en' : 'vi'
}

function localeFallback(locale?: string) {
  return normalizedLocale(locale) === 'en' ? 'vi' : 'en'
}

export function resolvePlanMarkdownPath(relativePath: string, locale?: string) {
  const normalized = String(relativePath || '')
    .replace(/^\.?\/+/, '')
    .replace(/^\/+/, '')

  if (normalized.startsWith('documents/')) return normalized

  const unprefixed = normalized.replace(/^(vi|en)\//, '')
  const primary = `${normalizedLocale(locale)}/${unprefixed}`
  const secondary = `${localeFallback(locale)}/${unprefixed}`

  if (typeof byPath[primary] === 'string') return primary
  if (typeof byPath[secondary] === 'string') return secondary
  return unprefixed
}

export function loadMarkdown(relativePath: string, locale?: string) {
  const resolved = resolvePlanMarkdownPath(relativePath, locale)
  const content = byPath[resolved]
  if (typeof content !== 'string') {
    return {
      ok: false as const,
      path: resolved,
      text: `_Missing file: \`${resolved}\`_`,
    }
  }
  return { ok: true as const, path: resolved, text: content }
}

export function isBundledPath(relativePath: string, locale?: string) {
  return loadMarkdown(relativePath, locale).ok
}
