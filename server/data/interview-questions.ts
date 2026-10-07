import { l } from './interview-questions-shared'
import type {
  InterviewCategory,
  Localized,
  InterviewQuestion,
} from './interview-questions-shared'
import { INTERVIEW_SOFT_QUESTIONS } from './interview-questions-soft'
import { INTERVIEW_SITUATIONAL_QUESTIONS } from './interview-questions-situational'
import { INTERVIEW_TECHNICAL_QUESTIONS } from './interview-questions-technical'

export type { InterviewCategory, InterviewLang, InterviewQuestion, Localized } from './interview-questions-shared'

export const INTERVIEW_CATEGORIES: {
  id: InterviewCategory
  title: Localized
  blurb: Localized
}[] = [
  {
    id: 'soft',
    title: l('Intro & Soft skills', 'Giới thiệu & Soft'),
    blurb: l(
      'Self-intro, project stories, leadership, mentoring, feedback, senior judgment',
      'Self-intro, project story, leadership, mentoring, feedback, judgment của senior',
    ),
  },
  {
    id: 'technical',
    title: l('Technical deep-dive', 'Technical sâu'),
    blurb: l(
      'JavaScript, TypeScript, Vue/Nuxt, React, browser internals, testing, security, live coding',
      'JavaScript, TypeScript, Vue/Nuxt, React, browser internals, testing, security, live coding',
    ),
  },
  {
    id: 'situational',
    title: l('Situational / behavioral-tech', 'Tình huống thực tế'),
    blurb: l(
      'System design, architecture trade-offs, auth, caching, scaling UI, product and team decisions',
      'System design, trade-off kiến trúc, auth, caching, scale UI, quyết định product và team',
    ),
  },
]

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  ...INTERVIEW_SOFT_QUESTIONS,
  ...INTERVIEW_TECHNICAL_QUESTIONS,
  ...INTERVIEW_SITUATIONAL_QUESTIONS,
]
