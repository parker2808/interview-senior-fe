import { marked } from 'marked'
import { uniqueSlug } from './slugify.mjs'

const SENIOR_LABELS = [
  /^what they actually ask/i,
  /^how a senior answers/i,
  /^how a senior works this/i,
  /^trade-?offs?$/i,
  /^production gotchas/i,
  /^follow-?ups?$/i,
  /^họ thực sự hỏi/i,
  /^cách (một )?senior/i,
  /^gotcha production/i,
  /^câu hỏi nối/i,
  /^điểm cần nhớ$/i,
]

const TAKEAWAY_HEADING = /key takeaways?|điểm (chính|cần nhớ)|takeaways?|tóm tắt/i

function tokenRaw(token) {
  if (!token) return ''
  if (typeof token.raw === 'string') return token.raw
  if (typeof token.text === 'string') return token.text
  return ''
}

function inlineText(token) {
  if (!token) return ''
  if (typeof token.text === 'string') return token.text.trimEnd()
  return tokenRaw(token).trim()
}

function serializeTokens(tokens) {
  if (!Array.isArray(tokens)) return ''
  return tokens.map((t) => tokenRaw(t)).join('').trim()
}

function listItemMarkdown(item) {
  if (Array.isArray(item.tokens) && item.tokens.length) {
    return serializeTokens(item.tokens)
  }
  return String(item.text || '').trim()
}

function isLabelText(text) {
  const m = String(text || '').trim().match(/^\*\*(.+?)\*\*$/)
  if (!m) return false
  const label = m[1].replace(/\s+/g, ' ').trim()
  return SENIOR_LABELS.some((re) => re.test(label))
}

function labelFromParagraph(text) {
  const m = String(text || '').trim().match(/^\*\*(.+?)\*\*$/)
  return m ? m[1].trim() : String(text || '').trim()
}

function tokensToMonoBlocks(tokens) {
  const used = new Set()
  const blocks = []

  for (const token of tokens) {
    if (!token || token.type === 'space') continue

    if (token.type === 'heading') {
      const text = inlineText(token)
      blocks.push({
        type: 'heading',
        level: token.depth,
        text,
        id: uniqueSlug(text, used),
        raw: token.raw,
      })
      continue
    }

    if (token.type === 'paragraph') {
      blocks.push({
        type: 'paragraph',
        text: inlineText(token),
        raw: token.raw,
      })
      continue
    }

    if (token.type === 'list') {
      blocks.push({
        type: 'list',
        style: token.ordered ? 'ol' : 'ul',
        items: (token.items || []).map((item) => listItemMarkdown(item)),
        raw: token.raw,
      })
      continue
    }

    if (token.type === 'code') {
      blocks.push({
        type: 'code',
        lang: String(token.lang || '').trim(),
        code: String(token.text || ''),
        raw: token.raw,
      })
      continue
    }

    if (token.type === 'table') {
      const headers = (token.header || []).map((cell) =>
        typeof cell === 'string' ? cell : inlineText(cell),
      )
      const rows = (token.rows || []).map((row) =>
        (row || []).map((cell) =>
          typeof cell === 'string' ? cell : inlineText(cell),
        ),
      )
      const align = Array.isArray(token.align)
        ? token.align.map((value) =>
            value === 'center' || value === 'right' || value === 'left'
              ? value
              : null,
          )
        : undefined
      blocks.push({
        type: 'table',
        headers,
        rows,
        align,
        raw: token.raw,
      })
      continue
    }

    if (token.type === 'blockquote') {
      blocks.push({
        type: 'callout',
        kind: 'quote',
        text: serializeTokens(token.tokens) || inlineText(token),
        raw: token.raw,
      })
      continue
    }

    if (token.type === 'hr') {
      blocks.push({ type: 'thematic-break', raw: token.raw })
      continue
    }

    blocks.push({
      type: 'markdown',
      text: tokenRaw(token).trim(),
      raw: token.raw,
    })
  }

  return blocks
}

function promoteLocalizedBlocks(blocks) {
  const out = []
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    const next = blocks[i + 1]

    if (
      block.type === 'heading' &&
      TAKEAWAY_HEADING.test(block.text.en) &&
      TAKEAWAY_HEADING.test(block.text.vi) &&
      next?.type === 'list'
    ) {
      out.push({
        type: 'key-takeaways',
        items: next.items,
      })
      i += 1
      continue
    }

    if (
      block.type === 'paragraph' &&
      isLabelText(block.text.en) &&
      isLabelText(block.text.vi)
    ) {
      const chunks = []
      let j = i + 1
      while (j < blocks.length) {
        const look = blocks[j]
        if (look.type === 'heading' || look.type === 'thematic-break') break
        if (
          look.type === 'paragraph' &&
          isLabelText(look.text.en) &&
          isLabelText(look.text.vi)
        ) {
          break
        }
        chunks.push(look)
        j += 1
      }
      out.push({
        type: 'senior-answer',
        label: {
          en: labelFromParagraph(block.text.en),
          vi: labelFromParagraph(block.text.vi),
        },
        text: {
          en: chunks.map((item) => localizedRaw(item, 'en')).join('\n\n').trim(),
          vi: chunks.map((item) => localizedRaw(item, 'vi')).join('\n\n').trim(),
        },
      })
      i = j - 1
      continue
    }

    out.push(block)
  }
  return out
}

function localizedRaw(block, lang) {
  if (!block) return ''
  if (block.type === 'paragraph') return block.text[lang]
  if (block.type === 'list') {
    const bullet = block.style === 'ol' ? '1.' : '-'
    return (block.items || [])
      .map((item) => `${bullet} ${item[lang] || ''}`)
      .join('\n')
  }
  if (block.type === 'code') {
    return `\`\`\`${block.lang || ''}\n${block.code[lang] || ''}\n\`\`\``
  }
  if (block.type === 'table') {
    return markdownTable(
      (block.headers || []).map((cell) => cell[lang] || ''),
      (block.rows || []).map((row) => row.map((cell) => cell[lang] || '')),
    )
  }
  if (block.type === 'callout') return block.text[lang]
  if (block.type === 'markdown') return block.text[lang]
  if (block.type === 'heading') return `${'#'.repeat(block.level)} ${block.text[lang]}`
  return ''
}

export function monoToMarkdown(block) {
  if (!block) return ''
  if (block.raw) return String(block.raw).trim()
  switch (block.type) {
    case 'heading':
      return `${'#'.repeat(block.level)} ${block.text}`
    case 'paragraph':
      return block.text
    case 'list': {
      const bullet = block.style === 'ol' ? '1.' : '-'
      return (block.items || [])
        .map((item) => `${bullet} ${item}`)
        .join('\n')
    }
    case 'code':
      return `\`\`\`${block.lang || ''}\n${block.code}\n\`\`\``
    case 'table':
      return markdownTable(block.headers, block.rows)
    case 'callout':
      return String(block.text || '')
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n')
    case 'senior-answer':
      return `**${block.label}**\n\n${block.text}`
    case 'key-takeaways':
      return (block.items || []).map((item) => `- ${item}`).join('\n')
    case 'thematic-break':
      return '---'
    case 'markdown':
      return block.text
    default:
      return ''
  }
}

function markdownTable(headers = [], rows = []) {
  const head = `| ${headers.join(' | ')} |`
  const sep = `| ${headers.map(() => '---').join(' | ')} |`
  const body = rows.map((row) => `| ${row.join(' | ')} |`).join('\n')
  return `${head}\n${sep}\n${body}`
}

export function parseMonoBlocks(markdown) {
  const tokens = marked.lexer(String(markdown || ''), { gfm: true })
  return tokensToMonoBlocks(tokens)
}

function zipAlign(enBlocks, viBlocks) {
  if (
    enBlocks.length === viBlocks.length &&
    enBlocks.every((block, i) => block.type === viBlocks[i]?.type)
  ) {
    return enBlocks.map((block, i) => [block, viBlocks[i]])
  }

  const pairs = []
  let ei = 0
  let vi = 0
  while (ei < enBlocks.length && vi < viBlocks.length) {
    const en = enBlocks[ei]
    const viBlock = viBlocks[vi]
    if (en.type === viBlock.type) {
      pairs.push([en, viBlock])
      ei += 1
      vi += 1
      continue
    }
    if (en.type === 'heading') {
      const match = viBlocks.findIndex(
        (block, idx) => idx >= vi && block.type === 'heading' && block.level === en.level,
      )
      if (match !== -1) {
        if (match > vi) {
          pairs.push([
            { type: 'markdown', text: viBlocks.slice(vi, match).map(monoToMarkdown).join('\n\n') },
            'vi-only',
          ])
        }
        pairs.push([en, viBlocks[match]])
        ei += 1
        vi = match + 1
        continue
      }
    }
    pairs.push([en, viBlock])
    ei += 1
    vi += 1
  }
  if (ei < enBlocks.length) {
    pairs.push([
      { type: 'markdown', text: enBlocks.slice(ei).map(monoToMarkdown).join('\n\n') },
      'en-only',
    ])
  }
  if (vi < viBlocks.length) {
    pairs.push([
      { type: 'markdown', text: viBlocks.slice(vi).map(monoToMarkdown).join('\n\n') },
      'vi-only',
    ])
  }
  return pairs
}

function loc(en, vi) {
  return { en: en ?? '', vi: vi ?? '' }
}

function mergePair(en, vi) {
  if (en === 'en-only' || vi === 'vi-only') {
    const only = en === 'en-only' ? vi : en
    return {
      type: 'markdown',
      text: loc(
        en === 'en-only' ? '' : only.text || monoToMarkdown(only),
        vi === 'vi-only' ? '' : only.text || monoToMarkdown(only),
      ),
    }
  }

  const type = en.type === vi.type ? en.type : 'markdown'
  if (type !== en.type || type !== vi.type) {
    return {
      type: 'markdown',
      text: loc(monoToMarkdown(en), monoToMarkdown(vi)),
    }
  }

  switch (type) {
    case 'heading':
      return {
        type,
        level: en.level,
        text: loc(en.text, vi.text),
        id: loc(en.id, vi.id),
      }
    case 'paragraph':
      return { type, text: loc(en.text, vi.text) }
    case 'list':
      return {
        type,
        style: en.style,
        items: zipArrays(en.items, vi.items).map(([a, b]) => loc(a, b)),
      }
    case 'callout':
      return { type, kind: en.kind || 'quote', text: loc(en.text, vi.text) }
    case 'code':
      return {
        type,
        lang: en.lang || vi.lang || '',
        code: loc(en.code, vi.code),
      }
    case 'table':
      return mergeTable(en, vi)
    case 'senior-answer':
      return {
        type,
        label: loc(en.label, vi.label),
        text: loc(en.text, vi.text),
      }
    case 'key-takeaways':
      return {
        type,
        items: zipArrays(en.items, vi.items).map(([a, b]) => loc(a, b)),
      }
    case 'thematic-break':
      return { type }
    case 'markdown':
    default:
      return {
        type: 'markdown',
        text: loc(monoToMarkdown(en), monoToMarkdown(vi)),
      }
  }
}

function zipArrays(a = [], b = []) {
  const len = Math.max(a.length, b.length)
  return Array.from({ length: len }, (_, i) => [a[i] ?? '', b[i] ?? ''])
}

function mergeTable(en, vi) {
  const headers = zipArrays(en.headers, vi.headers).map(([a, b]) => loc(a, b))
  const rowCount = Math.max(en.rows?.length || 0, vi.rows?.length || 0)
  const colCount = Math.max(
    ...[en.rows || [], vi.rows || []].flat().map((row) => row.length),
    headers.length,
    0,
  )
  const rows = Array.from({ length: rowCount }, (_, r) =>
    Array.from({ length: colCount }, (_, c) =>
      loc(en.rows?.[r]?.[c] ?? '', vi.rows?.[r]?.[c] ?? ''),
    ),
  )
  return {
    type: 'table',
    headers,
    rows,
    align: en.align || vi.align,
  }
}

export function zipLocalizedBlocks(enMarkdown, viMarkdown) {
  const enBlocks = parseMonoBlocks(enMarkdown)
  const viBlocks = parseMonoBlocks(viMarkdown)
  const aligned = zipAlign(enBlocks, viBlocks)
  const blocks = []
  for (const pair of aligned) {
    if (pair[1] === 'vi-only') {
      blocks.push({
        type: 'markdown',
        text: loc('', pair[0].text),
      })
      continue
    }
    if (pair[1] === 'en-only') {
      blocks.push({
        type: 'markdown',
        text: loc(pair[0].text, ''),
      })
      continue
    }
    blocks.push(mergePair(pair[0], pair[1]))
  }
  return { blocks, enCount: enBlocks.length, viCount: viBlocks.length }
}

export function blocksToSections(blocks, fallbackTitle) {
  const sections = []
  let current = {
    id: loc('intro', 'intro'),
    title: loc(fallbackTitle?.en || '', fallbackTitle?.vi || ''),
    blocks: [],
  }

  for (const block of blocks) {
    if (block.type === 'heading' && block.level === 2) {
      if (current.blocks.length) sections.push(current)
      current = {
        id: block.id,
        title: block.text,
        blocks: [block],
      }
      continue
    }
    current.blocks.push(block)
  }
  if (current.blocks.length) sections.push(current)
  return sections
}

export function firstParagraph(blocks) {
  for (const block of blocks) {
    if (block.type === 'paragraph' && (block.text.en || block.text.vi)) {
      return {
        en: truncate(block.text.en),
        vi: truncate(block.text.vi),
      }
    }
    if (block.type === 'markdown' && (block.text.en || block.text.vi)) {
      return {
        en: truncate(stripMd(block.text.en)),
        vi: truncate(stripMd(block.text.vi)),
      }
    }
  }
  return { en: '', vi: '' }
}

export function collectHeadings(sections) {
  const headings = []
  for (const section of sections) {
    for (const block of section.blocks) {
      if (block.type !== 'heading') continue
      if (block.level !== 2 && block.level !== 3) continue
      const skip =
        /table of contents|mục lục/i.test(block.text.en) ||
        /table of contents|mục lục/i.test(block.text.vi)
      if (skip) continue
      headings.push({
        id: block.id,
        text: block.text,
        level: block.level,
      })
    }
  }
  return headings
}

function stripMd(text) {
  return String(text || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncate(text, max = 220) {
  const value = String(text || '').replace(/\s+/g, ' ').trim()
  if (value.length <= max) return value
  return `${value.slice(0, max - 1).trim()}…`
}

export function fillMissingLocale(value) {
  if (Array.isArray(value)) {
    value.forEach(fillMissingLocale)
    return value
  }
  if (!value || typeof value !== 'object') return value
  const keys = Object.keys(value)
  if (
    keys.length <= 2 &&
    keys.every((key) => key === 'en' || key === 'vi') &&
    keys.every((key) => typeof value[key] === 'string')
  ) {
    if (value.en.trim() && !value.vi.trim()) value.vi = value.en
    if (value.vi.trim() && !value.en.trim()) value.en = value.vi
    return value
  }
  for (const child of Object.values(value)) fillMissingLocale(child)
  return value
}

export function markdownToDocBody(enMarkdown, viMarkdown, fallbackTitle) {
  const { blocks: rawBlocks, enCount, viCount } = zipLocalizedBlocks(
    enMarkdown,
    viMarkdown,
  )
  const typeMismatch = enCount !== viCount
  const blocks = promoteLocalizedBlocks(rawBlocks)
  const sections = fillMissingLocale(blocksToSections(blocks, fallbackTitle))
  return {
    sections,
    headings: collectHeadings(sections),
    fallback: typeMismatch,
    enCount,
    viCount,
  }
}
