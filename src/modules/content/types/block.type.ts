import type { Localized } from '@/modules/content/types/localized.type'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export type CalloutKind = 'note' | 'warning' | 'tip' | 'quote'

export type TableAlign = 'left' | 'center' | 'right' | null

export type HeadingBlock = {
  type: 'heading'
  level: HeadingLevel
  text: Localized
  id: Localized
}

export type ParagraphBlock = {
  type: 'paragraph'
  text: Localized
}

export type NestedListItem = Localized & {
  children?: ListBlock
}

export type ListBlock = {
  type: 'list'
  style: 'ul' | 'ol'
  items: Array<Localized | NestedListItem>
}

export type CalloutBlock = {
  type: 'callout'
  kind: CalloutKind
  text: Localized
}

export type CodeBlock = {
  type: 'code'
  lang: string
  code: Localized
}

export type TableBlock = {
  type: 'table'
  headers: Localized[]
  rows: Localized[][]
  align?: TableAlign[]
}

export type SeniorAnswerBlock = {
  type: 'senior-answer'
  label: Localized
  text: Localized
}

export type KeyTakeawaysBlock = {
  type: 'key-takeaways'
  items: Localized[]
}

export type MarkdownBlock = {
  type: 'markdown'
  text: Localized
}

export type ThematicBreakBlock = {
  type: 'thematic-break'
}

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | CalloutBlock
  | CodeBlock
  | TableBlock
  | SeniorAnswerBlock
  | KeyTakeawaysBlock
  | MarkdownBlock
  | ThematicBreakBlock

export type ContentSection = {
  id: Localized
  title: Localized
  blocks: ContentBlock[]
}

export type TocItem = {
  id: string
  text: string
  level: 2 | 3
}
