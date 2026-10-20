import { marked } from 'marked'
import { wrapMarkdownTables } from '@/modules/content/utils/markdown-table.util'

export function renderInline(text: string) {
  return marked.parseInline(String(text || ''), { async: false }) as string
}

export function renderMarkdown(text: string) {
  const html = marked.parse(String(text || ''), { async: false }) as string
  return wrapMarkdownTables(html)
}
