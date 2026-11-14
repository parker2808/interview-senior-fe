import type { FdeContent, FdeEntry, FdeLocalized } from '@/modules/fde/types/entities/fde-content.type'

export type JdRow = {
  slug: string
  source: string
  organizationAlias: string
  role: FdeLocalized
  level: FdeLocalized
  date: string
  tags: string[]
  title: FdeLocalized
  summary: FdeLocalized
  status: 'active' | 'archived'
  archivedAt?: string
  purgeAfter?: string
  testScore?: number
  fixture?: boolean
  telegram?: { url: string } | null
}

export type JdModule = FdeContent & {
  slug?: string
  entries: (FdeEntry & {
    kbRefs?: { slug: string; sectionId: string; state: 'pending' | 'live' | 'rejected' }[]
    embellishmentRefs?: string[]
  })[]
}
