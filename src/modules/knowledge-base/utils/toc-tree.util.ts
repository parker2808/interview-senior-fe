import type { TocItem } from '@/modules/content/types'

export type TocNode = TocItem & { children: TocNode[] }

export function nestTocItems(items: TocItem[]): TocNode[] {
  const roots: TocNode[] = []
  const stack: TocNode[] = []

  for (const item of items) {
    const node: TocNode = { ...item, children: [] }
    while (stack.length && stack[stack.length - 1].level >= node.level) {
      stack.pop()
    }
    if (!stack.length) roots.push(node)
    else stack[stack.length - 1].children.push(node)
    stack.push(node)
  }

  return roots
}

/** Ancestor ids only — expanding these reveals the active heading. */
export function tocAncestorIds(roots: TocNode[], targetId: string): string[] {
  if (!targetId) return []
  const path: string[] = []

  const walk = (nodes: TocNode[], trail: string[]): boolean => {
    for (const node of nodes) {
      if (node.id === targetId) {
        path.push(...trail)
        return true
      }
      if (walk(node.children, [...trail, node.id])) return true
    }
    return false
  }

  walk(roots, [])
  return path
}

export function tocParentIds(roots: TocNode[]): string[] {
  const ids: string[] = []
  const walk = (nodes: TocNode[]) => {
    for (const node of nodes) {
      if (node.children.length) {
        ids.push(node.id)
        walk(node.children)
      }
    }
  }
  walk(roots)
  return ids
}
