/** Resolve markdown hrefs for the study-plan Vue UI. */

export const GITHUB_BLOB_MAIN =
  'https://github.com/parker2808/interview-senior-fe/blob/main/'

/**
 * Resolve a relative path from a plan-relative or repo-root file path.
 * @param {string} fromPath e.g. `artifacts/day-01-user-flow.md` or `documents/vi/vue3.md`
 * @param {string} href e.g. `../../../documents/vi/vue3.md` or `./capstone-brief.md`
 * @returns {string} normalized path without leading ./
 */
export function resolveRelative(fromPath, href) {
  let base = fromPath.includes('/')
    ? fromPath.slice(0, fromPath.lastIndexOf('/') + 1)
    : ''
  let target = href.replace(/^\.\//, '')
  while (target.startsWith('../')) {
    target = target.slice(3)
    if (base) {
      const parts = base.replace(/\/$/, '').split('/')
      parts.pop()
      base = parts.length ? parts.join('/') + '/' : ''
    }
  }
  return (base + target).replace(/^\.\//, '')
}

/**
 * Normalize common path forms to a repo- or plan-relative lookup key.
 * @param {string} path
 */
export function normalizeDocPath(path) {
  return String(path || '')
    .replace(/^\.?\/+/, '')
    .replace(/^\/+/, '')
}

/**
 * @param {string} fromPath plan-relative or `documents/...` path of the current markdown file
 * @param {string} href raw href from <a>
 * @param {(path: string) => boolean} isBundledPath whether path loads from @plan / @kb
 * @returns {{ kind: 'ignore' } | { kind: 'hash', href: string } | { kind: 'external', url: string } | { kind: 'plan', path: string, hash?: string } | { kind: 'github', url: string }}
 */
export function classifyMarkdownHref(fromPath, href, isBundledPath) {
  if (!href || href.startsWith('mailto:')) return { kind: 'ignore' }
  if (href.startsWith('http://') || href.startsWith('https://')) {
    // Prefer in-app when the URL is our GitHub blob for a bundled file
    const blobPrefix = GITHUB_BLOB_MAIN
    if (href.startsWith(blobPrefix)) {
      const rest = href.slice(blobPrefix.length)
      const [pathPart, hash] = rest.split('#')
      const normalized = normalizeDocPath(pathPart)
      if (isBundledPath(normalized)) {
        return { kind: 'plan', path: normalized, hash: hash || undefined }
      }
    }
    return { kind: 'external', url: href }
  }
  if (href.startsWith('#')) {
    return { kind: 'hash', href }
  }

  const [pathPart, hash] = href.split('#')
  if (!pathPart) {
    return { kind: 'hash', href: href }
  }

  // Absolute-from-repo forms: /documents/vi/x.md or documents/vi/x.md
  let resolved
  const stripped = normalizeDocPath(pathPart)
  if (
    stripped.startsWith('documents/') ||
    stripped === 'README.md' ||
    stripped === 'README-en.md' ||
    stripped === 'jd1.md' ||
    stripped.startsWith('modules/')
  ) {
    resolved = stripped
  } else {
    resolved = normalizeDocPath(resolveRelative(fromPath, pathPart))
  }

  // Bundled plan content or shared KB → in-app navigation
  if (isBundledPath(resolved)) {
    return { kind: 'plan', path: resolved, hash: hash || undefined }
  }

  // Repo-root files not in the Vite bundle → GitHub blob on main
  if (
    resolved.startsWith('documents/') ||
    resolved === 'README.md' ||
    resolved === 'README-en.md' ||
    resolved === 'jd1.md' ||
    resolved.startsWith('modules/')
  ) {
    const url = GITHUB_BLOB_MAIN + resolved + (hash ? `#${hash}` : '')
    return { kind: 'github', url }
  }

  // Leftover unknown → try GitHub under modules/study-plan-30-days/content/
  const contentRepoPath = `modules/study-plan-30-days/content/${resolved}`
  return {
    kind: 'github',
    url: GITHUB_BLOB_MAIN + contentRepoPath + (hash ? `#${hash}` : ''),
  }
}
