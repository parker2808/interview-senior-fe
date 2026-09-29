export type InterviewLang = 'vi' | 'en'
export type InterviewCategoryId = 'soft' | 'technical' | 'situational'

export type Localized = Record<InterviewLang, string>

export type InterviewCategoryMeta = {
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
