import type { Localized } from '@/modules/content/types/localized.type'
import type { ContentSection } from '@/modules/content/types/block.type'

export type PlanStudyLink =
  | {
      kind: 'docs'
      slug: string
      label: Localized
    }
  | {
      kind: 'plan'
      resourceId: string
      path?: string
      label: Localized
    }

export type PlanQuestionLink = {
  id: string
  label: Localized
}

export type PlanAlgoTask = {
  resourceId: string
  path?: string
  label: Localized
}

export type PlanWeek = {
  week: number
  title: Localized
  range: Localized
  goal: Localized
  outcomes: Localized[]
}

export type PlanDaySummary = {
  day: number
  /** Legacy calendar label from the data repo. The app strips this and does not display it. */
  date?: string
  week: number
  title: Localized
  goal: Localized
  studyLinks: PlanStudyLink[]
  questionLinks: PlanQuestionLink[]
  handsOn: Localized[]
  algorithm: PlanAlgoTask
  checklist: Localized[]
  note?: Localized
}

export type PlanDay = PlanDaySummary & {
  kind: 'plan-day'
  lab: {
    resourceId: string
    title: Localized
    sections: ContentSection[]
  }
}

export type PlanResourceSummary = {
  id: string
  title: Localized
  aliases: string[]
}

export type PlanResource = PlanResourceSummary & {
  kind: 'plan-resource'
  sections: ContentSection[]
}

export type PlanMeta = {
  weeks: PlanWeek[]
  gaps: Localized[]
  resources: PlanResourceSummary[]
}

export type PlanIndex = PlanMeta & {
  days: PlanDaySummary[]
}
