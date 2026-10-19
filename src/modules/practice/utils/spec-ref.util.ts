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

const SECTION_ID_RE = /^\d+(?:\.\d+)*$/

/** Parse `§5.1`, `5.1`, or a string that starts with a section id. */
export function parseSpecSectionId(ref: string): string | null {
  const value = String(ref || '').trim()
  if (!value) return null
  const exact = value.match(/^§\s*(\d+(?:\.\d+)*)\s*$/)
  if (exact) return exact[1]
  const prefixed = value.match(/^§\s*(\d+(?:\.\d+)*)\b/)
  if (prefixed) return prefixed[1]
  const bare = value.match(/^(\d+(?:\.\d+)*)\s*$/)
  if (bare) return bare[1]
  return null
}

function leadingSectionId(headingText: string): string | null {
  const text = String(headingText || '')
    .replace(/<[^>]+>/g, '')
    .trim()
  const match = text.match(/^(\d+(?:\.\d+)*)/)
  return match?.[1] ?? null
}

/**
 * A spec heading matches `X.Y` when its visible text starts with that number
 * and is not a longer number (`1` must not steal `1.5`).
 */
export function headingMatchesSection(headingText: string, sectionId: string): boolean {
  const id = String(sectionId || '').trim()
  if (!SECTION_ID_RE.test(id)) return false
  const leading = leadingSectionId(headingText)
  return leading === id
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

export function renderSpecMarkdown(markdown: string): { html: string; toc: TocItem[] } {
  return enhanceMarkdownHtml(renderMarkdown(markdown))
}

export function specMatchesQuery(text: string, query: string): boolean {
  const keywords = splitSearchKeywords(query)
  if (!keywords.length) return true
  return matchesAllKeywords(foldSearchText(text), keywords)
}

type MdSection = { heading: string; body: string }

function splitMarkdownByHeadings(markdown: string): MdSection[] {
  const lines = String(markdown || '').split(/\r?\n/)
  const sections: MdSection[] = []
  let current: MdSection | null = null
  for (const line of lines) {
    const heading = line.match(/^#{1,6}\s+(.+)$/)
    if (heading) {
      if (current) sections.push(current)
      current = { heading: heading[1].trim(), body: '' }
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

  const sections = splitMarkdownByHeadings(markdown)
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
