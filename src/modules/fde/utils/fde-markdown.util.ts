import { Marked } from 'marked'
import { escapeHtml } from '@/modules/knowledge-base/utils/search-text.util'

const markdown = new Marked({
  gfm: false,
  renderer: {
    html({ text }) {
      return escapeHtml(text)
    },
    link({ tokens }) {
      return this.parser.parseInline(tokens)
    },
    image({ text }) {
      return escapeHtml(text)
    },
    code({ text }) {
      return `<pre class="max-w-full overflow-x-auto whitespace-pre"><code>${escapeHtml(text)}\n</code></pre>\n`
    },
  },
})

export function renderFdeDetail(text: string): string {
  return markdown.parse(text, { async: false }) as string
}
