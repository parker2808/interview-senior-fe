import { describe, expect, it } from 'vitest'
import { renderFdeDetail } from '../src/modules/fde/utils/fde-markdown.util'

describe('FDE detail markdown', () => {
  it('renders paragraphs, bullets, bold and inline code', () => {
    const html = renderFdeDetail('**How it works**\n\nUse `inventionId`.\n\n- Parse email\n- Create ticket')
    expect(html).toContain('<p><strong>How it works</strong></p>')
    expect(html).toContain('<code>inventionId</code>')
    expect(html).toContain('<ul>\n<li>Parse email</li>\n<li>Create ticket</li>')
  })

  it('preserves ASCII alignment and code indentation inside scrollable pre blocks', () => {
    const diagram = 'Email    -> Gateway\n            |\n            +--> Monday'
    const code = 'if (ready) {\n  writeBack();\n}'
    const html = renderFdeDetail(`\`\`\`text\n${diagram}\n\`\`\`\n\nProposal, not repo code\n\n\`\`\`js\n${code}\n\`\`\``)
    expect(html).toContain(`${diagram.replace(/>/g, '&gt;')}\n</code></pre>`)
    expect(html).toContain(`${code}\n</code></pre>`)
    expect(html.match(/class="max-w-full overflow-x-auto whitespace-pre"/g)).toHaveLength(2)
    expect(html).toContain('<p>Proposal, not repo code</p>')
  })

  it('escapes raw HTML, including inside bold text and fenced code', () => {
    const html = renderFdeDetail('<script>alert(1)</script>\n\n**<img src=x onerror=alert(1)>**\n\n```html\n</code><iframe src=x>\n```')
    expect(html).not.toMatch(/<(script|img|iframe)\b/)
    expect(html).toContain('&lt;script&gt;')
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;')
    expect(html).toContain('&lt;/code&gt;&lt;iframe src=x&gt;')
  })

  it('renders link labels and image alt text without active URLs or attributes', () => {
    const html = renderFdeDetail('[**Guide**](javascript:alert%281%29) ![icon](https://example.test/tracker)\n\n<https://example.test>')
    expect(html).toContain('<strong>Guide</strong> icon')
    expect(html).not.toMatch(/<(a|img)\b|href=|src=/)
  })

  it('does not change the existing shared markdown renderer', async () => {
    const { renderMarkdown } = await import('../src/modules/content/utils/inline-md.util')
    expect(renderMarkdown('[Guide](https://example.test)')).toContain('<a href=')
  })
})
