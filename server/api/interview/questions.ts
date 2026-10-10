import { verifyInterviewToken } from '../../utils/interviewAuth'
import {
  INTERVIEW_CATEGORIES,
  INTERVIEW_QUESTIONS,
} from '../../data/interview-questions'
import { readInterviewSessionToken } from '../../utils/sessionCookie'

export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    'Cache-Control': 'no-store',
  })

  if (event.method !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: `Method ${event.method} not allowed`,
    })
  }

  const token = readInterviewSessionToken(event)
  if (!verifyInterviewToken(token)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: {
        error: 'Valid interview session required',
        code: 'SESSION_EXPIRED',
      },
    })
  }

  return {
    ok: true,
    categories: INTERVIEW_CATEGORIES,
    questions: INTERVIEW_QUESTIONS,
  }
})
