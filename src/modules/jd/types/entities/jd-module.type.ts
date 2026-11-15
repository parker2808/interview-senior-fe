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
  action?: JdActionHandoff | null
}

export type JdActionHandoff = { command: string; url: string | null; deepLink: boolean }

export type JdModule = FdeContent & {
  slug?: string
  action?: JdActionHandoff | null
  entries: (FdeEntry & {
    kbRefs?: { slug: string; sectionId: string; state: 'pending' | 'live' | 'rejected' }[]
    embellishmentRefs?: string[]
  })[]
}
