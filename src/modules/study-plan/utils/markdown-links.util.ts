import { stripPlanLocalePrefix } from '@/modules/study-plan/utils/plan-locale-path.util'

export const GITHUB_BLOB_MAIN =
  'https://github.com/parker2808/interview-senior-fe/blob/main/'

export function resolveRelative(fromPath: string, href: string): string {
  let base = fromPath.includes('/')
    ? fromPath.slice(0, fromPath.lastIndexOf('/') + 1)
    : ''
  let target = href.replace(/^\.\//, '')
  while (target.startsWith('../')) {
    target = target.slice(3)
    if (base) {
      const parts = base.replace(/\/$/, '').split('/')
      parts.pop()
      base = parts.length ? `${parts.join('/')}/` : ''
    }
  }
  return (base + target).replace(/^\.\//, '')
}

export function normalizeDocPath(path: string) {
  return String(path || '')
    .replace(/^\.?\/+/, '')
    .replace(/^\/+/, '')
}

export type MarkdownHrefResult =
  | { kind: 'ignore' }
  | { kind: 'hash'; href: string }
  | { kind: 'external'; url: string }
  | { kind: 'plan'; path: string; hash?: string }
  | { kind: 'github'; url: string }
  | { kind: 'docs'; lang: string; slug: string; hash?: string }

export function classifyMarkdownHref(
  fromPath: string,
  href: string,
  isBundled: (path: string) => boolean,
): MarkdownHrefResult {
  if (!href || href.startsWith('mailto:')) return { kind: 'ignore' }
  if (href.startsWith('http://') || href.startsWith('https://')) {
    if (href.startsWith(GITHUB_BLOB_MAIN)) {
      const rest = href.slice(GITHUB_BLOB_MAIN.length)
      const [pathPart, hash] = rest.split('#')
      const normalized = normalizeDocPath(pathPart)
      if (isBundled(normalized)) {
        return { kind: 'plan', path: normalized, hash: hash || undefined }
      }
    }
    return { kind: 'external', url: href }
  }
  if (href.startsWith('#')) return { kind: 'hash', href }

  const [pathPart, hash] = href.split('#')
  if (!pathPart) return { kind: 'hash', href }

  let resolved: string
  const stripped = normalizeDocPath(pathPart)
  const from = stripPlanLocalePrefix(fromPath)

  if (
    stripped.startsWith('documents/') ||
    stripped === 'README.md' ||
    stripped === 'README-en.md' ||
    stripped === 'jd1.md' ||
    stripped.startsWith('modules/') ||
    stripped.startsWith('artifacts/')
  ) {
    resolved = stripped
  } else if (stripped.startsWith('capstone/')) {
    resolved = `artifacts/${stripped}`
  } else if (/^\d{2}-[a-z0-9-]+\.md$/i.test(stripped)) {
    resolved = `artifacts/capstone/${stripped}`
  } else {
    resolved = normalizeDocPath(resolveRelative(from, pathPart))
  }

  const docsMatch = resolved.match(/^documents\/(vi|en)\/([^/]+)\.md$/)
  if (docsMatch) {
    return {
      kind: 'docs',
      lang: docsMatch[1],
      slug: docsMatch[2],
      hash: hash || undefined,
    }
  }

  if (isBundled(resolved)) {
    return { kind: 'plan', path: resolved, hash: hash || undefined }
  }

  if (
    resolved.startsWith('documents/') ||
    resolved === 'README.md' ||
    resolved === 'README-en.md' ||
    resolved === 'jd1.md' ||
    resolved.startsWith('modules/')
  ) {
    return {
      kind: 'github',
      url: GITHUB_BLOB_MAIN + resolved + (hash ? `#${hash}` : ''),
    }
  }

  const contentRepoPath = `modules/study-plan-30-days/content/${resolved}`
  return {
    kind: 'github',
    url: GITHUB_BLOB_MAIN + contentRepoPath + (hash ? `#${hash}` : ''),
  }
}
