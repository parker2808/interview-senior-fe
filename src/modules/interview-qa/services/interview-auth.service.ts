import { toAuthApiError } from '@/modules/core/utils/api-error.util'
import type {
  InterviewCategoryMeta,
  InterviewQuestion,
} from '@/modules/interview-qa/types/interview.type'

export function interviewQuestionsUrl() {
  return '/api/interview/questions'
}

export async function fetchInterviewQuestions() {
  try {
    return await $fetch<{
      ok: true
      categories: InterviewCategoryMeta[]
      questions: InterviewQuestion[]
    }>(interviewQuestionsUrl(), {
      credentials: 'include',
      cache: 'no-store',
    })
  } catch (err) {
    throw toAuthApiError(err)
  }
}
