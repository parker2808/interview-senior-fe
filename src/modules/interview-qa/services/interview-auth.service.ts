import { clearAuthSession } from '@/modules/core/services/auth-session.service'
import { toAuthApiError } from '@/modules/core/utils/api-error.util'
import {
  clearInterviewToken,
  interviewAuthHeaders,
  readInterviewToken,
  writeInterviewToken,
} from '@/modules/core/utils/interview-token.util'
import type {
  InterviewCategoryMeta,
  InterviewQuestion,
} from '@/modules/interview-qa/types/interview.type'

type SessionFetch = (url: string, opts?: Record<string, unknown>) => Promise<unknown>

function defaultFetch(url: string, opts?: Record<string, unknown>) {
  return $fetch(url, { credentials: 'include', ...opts })
}

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
    writeInterviewToken(data.token)
    return data
  } catch (err) {
    throw toAuthApiError(err)
  }
}

export async function fetchInterviewQuestions(
  requestFetch: SessionFetch = defaultFetch,
  token?: string,
) {
  const bearer = token ?? readInterviewToken()
  try {
    return await requestFetch(interviewQuestionsUrl(), {
      credentials: 'include',
      cache: 'no-store',
      headers: {
        ...interviewAuthHeaders(bearer),
      },
    }) as {
      ok: true
      categories: InterviewCategoryMeta[]
      questions: InterviewQuestion[]
    }
  } catch (err) {
    throw toAuthApiError(err)
  }
}

export async function lockInterviewSession() {
  clearInterviewToken()
  await clearAuthSession('interview').catch(() => {})
}
