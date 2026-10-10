import type { Localized } from '@/modules/content/types/localized.type'
import type { ContentSection, TocItem } from '@/modules/content/types/block.type'

export type DocCategoryId =
  | 'core'
  | 'vue'
  | 'react'
  | 'practices'
  | 'infra'
  | 'pro'

export type KnowledgeDoc = {
  kind: 'knowledge-doc'
  slug: string
  title: Localized
  summary: Localized
  category: DocCategoryId
  order: number
  tags: string[]
  sections: ContentSection[]
}

export type KnowledgeHeading = {
  id: Localized
  text: Localized
  level: number
}

export type KnowledgeDocSummary = {
  slug: string
  title: Localized
  summary: Localized
  category: DocCategoryId
  order: number
  tags: string[]
  headings: KnowledgeHeading[]
}

export type KnowledgeGroup = {
  id: DocCategoryId
  order: number
  topics: KnowledgeDocSummary[]
}

export type KnowledgeCatalog = {
  groups: KnowledgeGroup[]
  docs: KnowledgeDocSummary[]
  defaultSlug: string
}

export type KnowledgeDocResponse = KnowledgeDoc & {
  adjacent: {
    prev: KnowledgeDocSummary | null
    next: KnowledgeDocSummary | null
  }
}

export type LocalizedToc = Record<'en' | 'vi', TocItem[]>
