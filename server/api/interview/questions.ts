import { verifyInterviewToken } from '../../utils/interviewAuth'
import { readInterviewBank } from '../../utils/contentStore'
import { readInterviewSessionToken } from '../../utils/sessionCookie'

export default defineEventHandler(async (event) => {
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

  const bank = await readInterviewBank()
  return {
    ok: true,
    categories: bank.categories,
    questions: bank.questions,
  }
})
