export type InterviewLang = 'vi' | 'en'
export type InterviewCategory = 'soft' | 'technical' | 'situational'

export type Localized = Record<InterviewLang, string>

export type InterviewQuestion = {
  id: string
  category: InterviewCategory
  tags: string[]
  question: Localized
  /** Markdown-ish answer body */
  answer: Localized
  /** Concrete example / story / code */
  example?: Localized
  /** Likely follow-ups from interviewer */
  followUps?: Localized[]
}

export function l(en: string, vi: string): Localized {
  return { en, vi }
}

export function q(item: InterviewQuestion): InterviewQuestion {
  return item
}
