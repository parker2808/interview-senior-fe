import { verifyEditToken } from '../../utils/editAuth'
import { verifyInterviewToken } from '../../utils/interviewAuth'
import {
  EDIT_SESSION_COOKIE,
  INTERVIEW_SESSION_COOKIE,
  clearSessionCookie,
  readEditSessionToken,
  readInterviewSessionToken,
} from '../../utils/sessionCookie'

function sessionHeaders(event: Parameters<typeof setResponseHeaders>[0]) {
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-edit-token',
    'Cache-Control': 'no-store',
  })
}

export default defineEventHandler((event) => {
  sessionHeaders(event)

  if (event.method === 'OPTIONS') {
    setResponseStatus(event, 204)
    return null
  }

  if (event.method === 'GET') {
    return {
      ok: true,
      interview: verifyInterviewToken(readInterviewSessionToken(event)),
      edit: verifyEditToken(readEditSessionToken(event)),
    }
  }

  if (event.method === 'DELETE') {
    const scope = String(getQuery(event).scope || 'all')
    if (scope === 'interview' || scope === 'all') {
      clearSessionCookie(event, INTERVIEW_SESSION_COOKIE)
    }
    if (scope === 'edit' || scope === 'all') {
      clearSessionCookie(event, EDIT_SESSION_COOKIE)
    }
    return { ok: true }
  }

  throw createError({
    statusCode: 405,
    statusMessage: `Method ${event.method} not allowed`,
  })
})
