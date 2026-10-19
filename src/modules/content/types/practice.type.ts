import type { Localized } from '@/modules/content/types/localized.type'
import type { TocItem } from '@/modules/content/types/block.type'

export type PracticeMilestoneId =
  | 'm0'
  | 'm1'
  | 'm2'
  | 'm3'
  | 'm4'
  | 'm5'
  | 'm6'
  | 'm7'

export type PracticeStepId = `p${string}`

export type PracticeConcept = {
  term: Localized
  explain: Localized
}

export type PracticeKbLink = {
  slug: string
  label: Localized
}

export type PracticeQuestionLink = {
  id: string
  label: Localized
}

export type PracticeTaskCode = {
  lang: string
  text: string
}

export type PracticeTask = {
  title: Localized
  detail: Localized
  code?: PracticeTaskCode
}

export type PracticeMilestone = {
  id: PracticeMilestoneId
  title: Localized
  goal: Localized
  outcome: Localized
  steps: string[]
}

export type PracticeStepSummary = {
  id: string
  milestone: string
  order: number
  title: Localized
  summary: Localized
  estimateMin: number
  tags: string[]
  prereqs: string[]
}

export type PracticeStep = PracticeStepSummary & {
  kind: 'practice-step'
  concepts: PracticeConcept[]
  kbLinks: PracticeKbLink[]
  questionLinks: PracticeQuestionLink[]
  specRefs: string[]
  tasks: PracticeTask[]
  doneWhen: Localized[]
  pitfalls: Localized[]
  commit: string
}

export type PracticeMeta = {
  version: number
  title: Localized
  intro: Localized
  specPath: string
  draft?: true
  milestones: PracticeMilestone[]
}

export type PracticeIndex = {
  version: number
  title: Localized
  intro: Localized
  milestones: PracticeMilestone[]
  steps: PracticeStepSummary[]
}

export type PracticeDesignGroup = 'public' | 'admin'
export type PracticeDesignTheme = 'light' | 'dark'
export type PracticeDesignViewport = 'desktop' | 'mobile'

export type PracticeDesignScreen = {
  id: string
  file: string
  title: Localized
  caption: Localized
  group: PracticeDesignGroup
  theme: PracticeDesignTheme
  viewport: PracticeDesignViewport
  specRefs: string[]
  width: number
  height: number
}

export type PracticeDesignFigma = {
  url: string
  label: Localized
  note: Localized
}

export type PracticeDesignIndex = {
  version: 1
  specPath: string
  title: Localized
  intro: Localized
  screens: PracticeDesignScreen[]
  figma?: PracticeDesignFigma
}

export type PracticeDesignPayload = {
  index: PracticeDesignIndex
  specMarkdown: string
  headings: TocItem[]
}
