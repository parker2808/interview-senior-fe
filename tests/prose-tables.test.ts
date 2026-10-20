import { describe, expect, it } from 'vitest'
import { renderMarkdown } from '@/modules/content/utils/inline-md.util'
import {
  annotateMarkdownTableCells,
  wrapMarkdownTables,
} from '@/modules/content/utils/markdown-table.util'

const markdown = `
| Group | Entity | Fields | Notes |
| --- | --- | --- | --- |
| Site | \`SiteSettings\` | \`siteName\`, \`domain\` | Default SEO |
`.trim()

describe('markdown tables', () => {
  it('wraps GFM tables and stamps header labels on cells', () => {
    const html = renderMarkdown(markdown)
    expect(html).toContain('class="prose-table-wrap"')
    expect(html).toContain('<table>')
    expect(html).toContain('data-label="Group"')
    expect(html).toContain('data-label="Entity"')
    expect(html).toContain('data-label="Fields"')
    expect(html).toContain('data-label="Notes"')
    expect(html).toContain('<code>SiteSettings</code>')
  })

  it('is idempotent when wrapping already-wrapped HTML', () => {
    const once = wrapMarkdownTables(renderMarkdown(markdown))
    const twice = wrapMarkdownTables(once)
    expect(twice.split('prose-table-wrap').length).toBe(once.split('prose-table-wrap').length)
  })

  it('does not overwrite an existing data-label', () => {
    const html = annotateMarkdownTableCells(
      `<table><thead><tr><th>A</th></tr></thead><tbody><tr><td data-label="Kept">x</td></tr></tbody></table>`,
    )
    expect(html).toContain('data-label="Kept"')
    expect(html).not.toContain('data-label="A"')
  })
})
