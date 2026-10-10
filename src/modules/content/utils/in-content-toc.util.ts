import type { ContentBlock, ContentSection, Localized } from '@/modules/content/types'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'
import { ensureSectionHeadingIds } from '@/modules/knowledge-base/utils/heading-anchor.util'

const TOC_HEADING = /^(table of contents|mục lục)$/i

export function isTocHeadingText(text: string) {
  return TOC_HEADING.test(String(text || '').trim())
}

function localizedIds(value: Localized | undefined) {
  if (!value) return []
  return [value.en, value.vi].map((id) => String(id || '').trim()).filter(Boolean)
}

function stripTocFromMarkdown(markdown: string) {
  return String(markdown || '').replace(
    /^(#{1,6})\s+(Table of Contents|Mục lục)\s*\n+(?:(?:\s*(?:[-*+]|\d+[.)])[^\n]*\n?)+)/gim,
    '',
  )
}

function filterBlocks(blocks: ContentBlock[]) {
  const next: ContentBlock[] = []
  const hiddenIds: string[] = []

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i]
    if (
      block.type === 'heading' &&
      (isTocHeadingText(block.text.en) || isTocHeadingText(block.text.vi))
    ) {
      hiddenIds.push(...localizedIds(block.id))
      if (blocks[i + 1]?.type === 'list') i += 1
      continue
    }
    if (block.type === 'markdown') {
      next.push({
        type: 'markdown',
        text: {
          en: stripTocFromMarkdown(block.text.en),
          vi: stripTocFromMarkdown(block.text.vi),
        },
      })
      continue
    }
    next.push(block)
  }

  return { blocks: next, hiddenIds }
}

export function prepareReadableSections(
  sections: ContentSection[] | undefined,
  lang: string,
) {
  const hiddenIds: string[] = []
  const readable: ContentSection[] = []

  for (const section of sections || []) {
    const title = pickLocale(section.title, lang)
    if (
      isTocHeadingText(title) ||
      isTocHeadingText(section.title.en) ||
      isTocHeadingText(section.title.vi)
    ) {
      hiddenIds.push(...localizedIds(section.id))
      for (const block of section.blocks) {
        if (block.type === 'heading') hiddenIds.push(...localizedIds(block.id))
      }
      continue
    }

    const filtered = filterBlocks(section.blocks)
    hiddenIds.push(...filtered.hiddenIds)
    if (filtered.blocks.length) {
      readable.push({ ...section, blocks: filtered.blocks })
    }
  }

  return {
    sections: ensureSectionHeadingIds(readable, lang),
    hiddenIds: [...new Set(hiddenIds)],
  }
}
