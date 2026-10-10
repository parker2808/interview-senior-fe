import type { ListBlock, Localized } from '@/modules/content/types'

export type NestedListItem = Localized & {
  children?: ListBlock
}

export type NormalizedListItem = {
  text: Localized
  children?: ListBlock
}

export function isListBlock(value: unknown): value is ListBlock {
  return Boolean(
    value &&
      typeof value === 'object' &&
      (value as { type?: string }).type === 'list' &&
      Array.isArray((value as { items?: unknown }).items),
  )
}

export function normalizeListItem(item: Localized | NestedListItem): NormalizedListItem {
  const text: Localized = {
    en: String((item as Localized)?.en ?? ''),
    vi: String((item as Localized)?.vi ?? ''),
  }
  const children = (item as NestedListItem)?.children
  return children && isListBlock(children) ? { text, children } : { text }
}

export function looksLikeBlockMarkdown(text: string) {
  const value = String(text || '')
  if (!value) return false
  if (/```/.test(value)) return true
  if (/\n\s{0,3}(?:[-*+]|\d+[.)])\s+/.test(value)) return true
  if (/\n\s{0,3}>\s+/.test(value)) return true
  if (/\n\s*\|.+\|/.test(value)) return true
  return false
}

/**
 * Recover outline sub-items that the exporter flattened into one string,
 * e.g. `Core Concepts 1.1. Foo 1.2. Bar` or the same with newlines.
 */
export function expandListItemSource(text: string) {
  const value = String(text || '').trim()
  if (!value) return ''

  const rest = value.split('\n').slice(1).join('\n')
  if (/^\s{0,3}(?:[-*+]|\d+[.)])\s+/m.test(rest)) return value

  const parts = value.split(/(?=\d+\.\d+\.\s)/)
  if (parts.length < 2) return value

  const title = parts[0].trim()
  const subs = parts
    .slice(1)
    .map((part) => part.trim())
    .filter(Boolean)
  if (!title || !subs.length) return value
  return `${title}\n\n${subs.map((item) => `- ${item}`).join('\n')}`
}
