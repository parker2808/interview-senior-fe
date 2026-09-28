/** Resolve markdown hrefs for the study-plan Vue UI. */

export const GITHUB_BLOB_MAIN =
  'https://github.com/parker2808/interview-senior-fe/blob/main/'

/**
 * Resolve a relative path from a plan-relative file path.
 * @param {string} fromPath e.g. `artifacts/day-01-user-flow.md`
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
 * @param {string} fromPath plan-relative path of the current markdown file
 * @param {string} href raw href from <a>
 * @param {(path: string) => boolean} isBundledPath whether path loads from @plan / @kb
 * @returns {{ kind: 'ignore' } | { kind: 'hash', href: string } | { kind: 'external', url: string } | { kind: 'plan', path: string } | { kind: 'github', url: string }}
 */
export function classifyMarkdownHref(fromPath, href, isBundledPath) {
  if (!href || href.startsWith('mailto:')) return { kind: 'ignore' }
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return { kind: 'external', url: href }
  }
  if (href.startsWith('#')) {
    return { kind: 'hash', href }
  }

  const [pathPart, hash] = href.split('#')
  if (!pathPart) {
    return { kind: 'hash', href: href }
  }

  const resolved = resolveRelative(fromPath, pathPart)

  // Bundled plan content or shared KB (documents/en|vi) → in-app navigation
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

  // Relative path that walked above content via ../../../documents already caught;
  // leftover unknown → try GitHub under modules/study-plan-30-days/content/
  const contentRepoPath = `modules/study-plan-30-days/content/${resolved}`
  return {
    kind: 'github',
    url: GITHUB_BLOB_MAIN + contentRepoPath + (hash ? `#${hash}` : ''),
  }
}
