import { verifyInterviewToken } from '../../utils/interviewAuth'
import {
  INTERVIEW_CATEGORIES,
  INTERVIEW_QUESTIONS,
} from '../../data/interview-questions'

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

  const auth = getHeader(event, 'authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  if (!verifyInterviewToken(token)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: { error: 'Valid interview session required' },
    })
  }

  return {
    ok: true,
    categories: INTERVIEW_CATEGORIES,
    questions: INTERVIEW_QUESTIONS,
  }
})
