import {
  INTERVIEW_TOKEN_TTL_MS,
  issueInterviewToken,
  verifyInterviewPasscode,
} from '../../utils/interviewAuth'
import {
  INTERVIEW_SESSION_COOKIE,
  setSessionCookie,
} from '../../utils/sessionCookie'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store',
  })

  if (event.method === 'OPTIONS') {
    setResponseStatus(event, 204)
    return null
  }

  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: `Method ${event.method} not allowed`,
    })
  }

  let body: { passcode?: string } | null
  try {
    body = await readBody(event)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Body must be JSON' })
  }

  const passcode =
    body && typeof body.passcode === 'string' ? body.passcode.trim() : ''

  const auth = verifyInterviewPasscode(passcode)
  if (!auth.ok) {
    throw createError({
      statusCode: auth.status,
      statusMessage: auth.error,
      data: { error: auth.error, code: auth.code },
    })
  }

  const issued = issueInterviewToken()
  setSessionCookie(
    event,
    INTERVIEW_SESSION_COOKIE,
    issued.token,
    INTERVIEW_TOKEN_TTL_MS,
  )
  return {
    ok: true,
    token: issued.token,
    expiresAt: issued.expiresAt,
  }
})
