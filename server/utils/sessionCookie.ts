import type { H3Event } from 'h3'

export const INTERVIEW_SESSION_COOKIE = 'sf_interview_session'
export const EDIT_SESSION_COOKIE = 'sf_edit_session'

function cookieSecure(event: H3Event) {
  return (
    process.env.NODE_ENV === 'production' ||
    getRequestProtocol(event) === 'https'
  )
}

export function sessionCookieOptions(event: H3Event, maxAgeSec?: number) {
  return {
    httpOnly: true,
    secure: cookieSecure(event),
    sameSite: 'lax' as const,
    path: '/',
    ...(typeof maxAgeSec === 'number' ? { maxAge: maxAgeSec } : {}),
  }
}

export function setSessionCookie(
  event: H3Event,
  name: string,
  token: string,
  maxAgeMs: number,
) {
  setCookie(
    event,
    name,
    token,
    sessionCookieOptions(event, Math.floor(maxAgeMs / 1000)),
  )
}

export function clearSessionCookie(event: H3Event, name: string) {
  deleteCookie(event, name, sessionCookieOptions(event))
}

export function readBearerToken(event: H3Event) {
  const auth = getHeader(event, 'authorization') || ''
  return auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
}

export function readInterviewSessionToken(event: H3Event) {
  return (
    readBearerToken(event) || getCookie(event, INTERVIEW_SESSION_COOKIE) || ''
  )
}

export function readEditSessionToken(event: H3Event) {
  return (
    getHeader(event, 'x-edit-token') ||
    getCookie(event, EDIT_SESSION_COOKIE) ||
    readBearerToken(event) ||
    ''
  )
}
