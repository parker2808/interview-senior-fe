export const GITHUB_BLOB_MAIN =
  'https://github.com/parker2808/interview-senior-fe/blob/main/'

export function normalizeDocPath(path: string) {
  return String(path || '')
    .replace(/^\.?\/+/, '')
    .replace(/^\/+/, '')
}

export type KbHrefResult =
  | { kind: 'ignore' }
  | { kind: 'hash'; id: string }
  | { kind: 'external'; url: string }
  | { kind: 'docs'; lang: string; slug: string; hash?: string }
  | { kind: 'github'; url: string }

/** Classify anchors inside KB markdown (documents/vi|en/*.md). */
export function classifyKbHref(href: string): KbHrefResult {
  if (!href || href.startsWith('mailto:')) return { kind: 'ignore' }

  if (href.startsWith('http://') || href.startsWith('https://')) {
    if (href.startsWith(GITHUB_BLOB_MAIN)) {
      const rest = href.slice(GITHUB_BLOB_MAIN.length)
      const [pathPart, hash] = rest.split('#')
      const docsMatch = normalizeDocPath(pathPart).match(
        /^documents\/(vi|en)\/([^/]+)\.md$/,
      )
      if (docsMatch) {
        return {
          kind: 'docs',
          lang: docsMatch[1],
          slug: docsMatch[2],
          hash: hash || undefined,
        }
      }
    }
    return { kind: 'external', url: href }
  }

  if (href.startsWith('#')) {
    return { kind: 'hash', id: href.slice(1) }
  }

  const [pathPart, hash] = href.split('#')
  if (!pathPart) return { kind: 'hash', id: hash || '' }

  const stripped = normalizeDocPath(pathPart)

  // Relative forms from documents/en|vi/*.md → ../../README.md, ../vi/foo.md, ./x.md
  const docsMatch = stripped.match(/(?:^|\/)documents\/(vi|en)\/([^/]+)\.md$/)
  if (docsMatch) {
    return {
      kind: 'docs',
      lang: docsMatch[1],
      slug: docsMatch[2],
      hash: hash || undefined,
    }
  }

  // Same-folder sibling: typescript.md / ./vue3.md
  const sibling = stripped.match(/^(?:\.\.\/)*(?:vi|en)\/([^/]+)\.md$/)
  if (sibling) {
    // ../vi/x from en/ or vi/x — lang unknown; caller may override
    return { kind: 'docs', lang: '', slug: sibling[1], hash: hash || undefined }
  }

  const bare = stripped.match(/^([^/]+)\.md$/)
  if (bare) {
    return { kind: 'docs', lang: '', slug: bare[1], hash: hash || undefined }
  }

  if (
    stripped === 'README.md' ||
    stripped === 'README-en.md' ||
    stripped.endsWith('/README.md') ||
    stripped.endsWith('/README-en.md') ||
    stripped === 'jd1.md' ||
    stripped.startsWith('modules/')
  ) {
    const repoPath = stripped
      .replace(/^\.\.\//, '')
      .replace(/^documents\//, 'documents/')
    // From documents/en/foo.md, ../../README-en.md → README-en.md
    const cleaned = stripped.replace(/^(\.\.\/)+/, '')
    return {
      kind: 'github',
      url: GITHUB_BLOB_MAIN + cleaned + (hash ? `#${hash}` : ''),
    }
  }

  return {
    kind: 'github',
    url: GITHUB_BLOB_MAIN + stripped + (hash ? `#${hash}` : ''),
  }
}
