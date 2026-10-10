import { clearAuthSession } from '@/modules/core/services/auth-session.service'
import { toAuthApiError } from '@/modules/core/utils/api-error.util'
import type {
  InterviewCategoryMeta,
  InterviewQuestion,
} from '@/modules/interview-qa/types/interview.type'

export function interviewAuthUrl() {
  return '/api/auth/interview'
}

export function interviewQuestionsUrl() {
  return '/api/interview/questions'
}

export async function unlockInterview(passcode: string) {
  try {
    const data = await $fetch<{
      ok?: boolean
      token?: string
      expiresAt?: string
    }>(interviewAuthUrl(), {
      method: 'POST',
      credentials: 'include',
      body: { passcode },
    })
    if (!data?.token) {
      throw toAuthApiError(new Error('Unlock failed'))
    }
    return data
  } catch (err) {
    throw toAuthApiError(err)
  }
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
    const mapped = toAuthApiError(err)
    if (mapped.status === 401 || mapped.code === 'SESSION_EXPIRED') {
      await clearAuthSession('interview').catch(() => {})
    }
    throw mapped
  }
}

export async function lockInterviewSession() {
  await clearAuthSession('interview').catch(() => {})
}
