import { marked } from 'marked'

export function renderInline(text: string) {
  return marked.parseInline(String(text || ''), { async: false }) as string
}

export function renderMarkdown(text: string) {
  return marked.parse(String(text || ''), { async: false }) as string
}
