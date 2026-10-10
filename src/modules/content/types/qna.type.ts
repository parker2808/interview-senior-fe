import type { Localized } from '@/modules/content/types/localized.type'

export type InterviewCategoryId = 'soft' | 'technical' | 'situational'

export type InterviewCategory = {
  id: InterviewCategoryId
  title: Localized
  blurb: Localized
}

export type InterviewQuestion = {
  id: string
  category: InterviewCategoryId
  tags: string[]
  question: Localized
  answer: Localized
  example?: Localized
  followUps?: Localized[]
}

export type InterviewBank = {
  categories: InterviewCategory[]
  questions: InterviewQuestion[]
}
