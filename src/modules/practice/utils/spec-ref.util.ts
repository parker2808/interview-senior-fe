import type { TocItem } from '@/modules/content/types'
import { enhanceMarkdownHtml } from '@/modules/knowledge-base/utils/toc.util'
import { renderMarkdown } from '@/modules/content/utils/inline-md.util'
import {
  foldSearchText,
  matchesAllKeywords,
  splitSearchKeywords,
} from '@/modules/knowledge-base/utils/search-text.util'

export const PRACTICE_DESIGN_PATH = '/practice/design'

export function designScreenSrc(file: string): string {
  const name = String(file || '')
    .replace(/^\/+/, '')
    .split(/[/\\]/)
    .pop()
  return name ? `/assets/practice-design/screens/${name}` : ''
}

/** `1`, `1.5`, `3.1b` — letter suffix is allowed for sibling sections. */
const SECTION_ID_RE = /^\d+(?:\.\d+)*[a-z]?$/i
const SECTION_ID_CAPTURE = /(\d+(?:\.\d+)*[a-z]?)/i

/** Stable HTML id so EN/VI headings share the same `#s-1-5` target. */
export function specAnchorId(sectionId: string): string {
  return `s-${String(sectionId || '')
    .trim()
    .toLowerCase()
    .replace(/\./g, '-')}`
}

/** Parse `§5.1`, `5.1`, `3.1b`, or a string that starts with a section id. */
export function parseSpecSectionId(ref: string): string | null {
  const value = String(ref || '').trim()
  if (!value) return null
  const exact = value.match(new RegExp(`^§\\s*${SECTION_ID_CAPTURE.source}\\s*$`, 'i'))
  if (exact) return exact[1]
  const prefixed = value.match(new RegExp(`^§\\s*${SECTION_ID_CAPTURE.source}\\b`, 'i'))
  if (prefixed) return prefixed[1]
  const bare = value.match(new RegExp(`^${SECTION_ID_CAPTURE.source}\\s*$`, 'i'))
  if (bare) return bare[1]
  const fromAnchor = value.match(/^#?s-([0-9]+(?:-[0-9]+)*[a-z]?)$/i)
  if (fromAnchor) return fromAnchor[1].replace(/-/g, '.')
  return null
}

export function leadingSectionId(headingText: string): string | null {
  const text = String(headingText || '')
    .replace(/<[^>]+>/g, '')
    .trim()
  const match = text.match(new RegExp(`^${SECTION_ID_CAPTURE.source}\\b`, 'i'))
  return match?.[1] ?? null
}

export function headingSpecAnchorId(headingText: string): string | null {
  const sectionId = leadingSectionId(headingText)
  return sectionId ? specAnchorId(sectionId) : null
}

/**
 * A spec heading matches `X.Y` when its visible text starts with that number
 * and is not a longer number (`1` must not steal `1.5`).
 */
export function headingMatchesSection(headingText: string, sectionId: string): boolean {
  const id = String(sectionId || '').trim()
  if (!SECTION_ID_RE.test(id)) return false
  const leading = leadingSectionId(headingText)
  if (!leading) return false
  return leading.toLowerCase() === id.toLowerCase()
}

export function mapSpecRefToHeading(
  ref: string,
  headings: Array<Pick<TocItem, 'id' | 'text'>>,
): Pick<TocItem, 'id' | 'text'> | null {
  const sectionId = parseSpecSectionId(ref)
  if (!sectionId) return null
  return headings.find((heading) => headingMatchesSection(heading.text, sectionId)) ?? null
}

export function specRefHref(
  ref: string,
  headings: Array<Pick<TocItem, 'id' | 'text'>> = [],
): string {
  const hit = mapSpecRefToHeading(ref, headings)
  const hash = hit?.id ? `#${encodeURIComponent(hit.id)}` : ''
  return `${PRACTICE_DESIGN_PATH}?tab=spec${hash}`
}

export function specHeadingsFromMarkdown(markdown: string): TocItem[] {
  return renderSpecMarkdown(markdown).toc
}

function decodeBasicEntities(s: string) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

const SAFE_SPEC_ANCHOR = /^s-[a-z0-9-]+$/i

function sanitizeHeadingInner(inner: string): string {
  return String(inner || '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
}

/**
 * Prefer explicit `s-…` ids (HTML `<h2 id="s-1">` from the data spec, or
 * derived from `§N.M`) so locale switches and § refs share the same hash.
 * Heading tags keep only that id (no onclick / style passthrough).
 */
export function renderSpecMarkdown(markdown: string): { html: string; toc: TocItem[] } {
  const rendered = enhanceMarkdownHtml(renderMarkdown(markdown))
  const toc: TocItem[] = []

  const html = rendered.html.replace(
    /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_full, levelStr: string, attrs: string, inner: string) => {
      const level = Number(levelStr)
      const safeInner = sanitizeHeadingInner(inner)
      const text = decodeBasicEntities(safeInner.replace(/<[^>]+>/g, '')).trim()
      const existing = attrs.match(/\sid=["']([^"']+)["']/i)?.[1] || ''
      const fromSection = headingSpecAnchorId(text)
      const id = SAFE_SPEC_ANCHOR.test(existing)
        ? existing
        : fromSection || `section-${level}`
      if (level >= 2) toc.push({ id, text, level })
      return `<h${level} id="${id}">${safeInner}</h${level}>`
    },
  )

  return { html, toc }
}

export function specMatchesQuery(text: string, query: string): boolean {
  const keywords = splitSearchKeywords(query)
  if (!keywords.length) return true
  return matchesAllKeywords(foldSearchText(text), keywords)
}

type MdSection = { heading: string; body: string }

function headingTextFromLine(line: string): string | null {
  const trimmed = String(line || '').trim()
  const md = trimmed.match(/^#{1,6}\s+(.+)$/)
  if (md) return md[1].trim()
  const html = trimmed.match(/^<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]\s*>$/i)
  if (html) {
    return decodeBasicEntities(html[1].replace(/<[^>]+>/g, '')).trim()
  }
  return null
}

/** Split on markdown `##` and HTML `<hN id="s-…">` headings (data-repo spec). */
export function splitSpecSections(markdown: string): MdSection[] {
  const lines = String(markdown || '').split(/\r?\n/)
  const sections: MdSection[] = []
  let current: MdSection | null = null
  for (const line of lines) {
    const heading = headingTextFromLine(line)
    if (heading) {
      if (current) sections.push(current)
      current = { heading, body: '' }
      continue
    }
    if (!current) current = { heading: '', body: `${line}\n` }
    else current.body += `${line}\n`
  }
  if (current) sections.push(current)
  return sections
}

/** Heading ids whose title or following section body match every keyword. */
export function matchingSpecHeadingIds(
  markdown: string,
  headings: TocItem[],
  query: string,
): string[] {
  const keywords = splitSearchKeywords(query)
  if (!keywords.length) return headings.map((item) => item.id)

  const sections = splitSpecSections(markdown)
  const claimed = new Set<number>()
  const ids: string[] = []

  for (const heading of headings) {
    let index = sections.findIndex(
      (section, i) => !claimed.has(i) && section.heading.trim() === heading.text.trim(),
    )
    if (index < 0) {
      const sectionId = leadingSectionId(heading.text)
      index = sections.findIndex(
        (section, i) =>
          !claimed.has(i) && sectionId != null && headingMatchesSection(section.heading, sectionId),
      )
    }
    const section = index >= 0 ? sections[index] : null
    if (index >= 0) claimed.add(index)
    const hay = foldSearchText(
      [heading.text, section?.heading, section?.body].filter(Boolean).join(' '),
    )
    if (matchesAllKeywords(hay, keywords)) ids.push(heading.id)
  }
  return ids
}
