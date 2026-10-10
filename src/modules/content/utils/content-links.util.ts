import { classifyKbHref } from '@/modules/knowledge-base/utils/kb-links.util'
import { classifyMarkdownHref } from '@/modules/study-plan/utils/markdown-links.util'

export type ContentHref =
  | { kind: 'ignore' }
  | { kind: 'hash'; id: string }
  | { kind: 'external'; url: string }
  | { kind: 'github'; url: string }
  | { kind: 'docs'; lang: string; slug: string; hash?: string }
  | { kind: 'plan'; path: string; hash?: string }

export function classifyContentHref(
  href: string,
  fromPath = '',
  knownPlanPaths: string[] = [],
): ContentHref {
  const bundled = (path: string) =>
    knownPlanPaths.some(
      (alias) => alias === path || alias.endsWith(`/${path}`) || path.endsWith(alias),
    )

  const hash = href.includes('#') ? href.split('#')[1] : undefined
  if (/artifacts\/algo\/problems\/day-\d+\.md(?:$|[?#])/.test(href)) {
    const path = href.replace(/.*artifacts\//, 'artifacts/').split('#')[0]
    return { kind: 'plan', path, hash }
  }
  if (/(?:^|\/)lab\/day-\d+-lab\.md(?:$|[?#])/.test(href)) {
    const path = href.replace(/.*lab\//, 'lab/').split('#')[0]
    return { kind: 'plan', path, hash }
  }

  if (fromPath) {
    const plan = classifyMarkdownHref(fromPath, href, bundled)
    if (plan.kind === 'hash') return { kind: 'hash', id: href.replace(/^#/, '') }
    if (plan.kind !== 'ignore') return plan
  }

  const kb = classifyKbHref(href)
  if (kb.kind === 'hash') return { kind: 'hash', id: kb.id }
  return kb
}
