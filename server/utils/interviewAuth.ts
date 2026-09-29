/**
 * Interview passcode auth — reuses EDIT_PASSCODE, optional INTERVIEW_PASSCODE override.
 */
import { createHmac, randomBytes } from 'node:crypto'
import {
  isSixDigitPasscode,
  safeEqualString,
} from './editAuth'

export const INTERVIEW_TOKEN_TTL_MS = 12 * 60 * 60 * 1000

function interviewPasscodeExpected() {
  return process.env.INTERVIEW_PASSCODE || process.env.EDIT_PASSCODE || ''
}

function tokenSecret() {
  const explicit = process.env.INTERVIEW_TOKEN_SECRET || process.env.EDIT_TOKEN_SECRET
  if (explicit) return explicit
  const pass = interviewPasscodeExpected()
  return createHmac('sha256', 'interview-qa-v1').update(pass).digest('hex')
}

function b64url(buf: Buffer | string) {
  return Buffer.from(buf)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function fromB64url(str: string) {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4))
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/') + pad
  return Buffer.from(b64, 'base64')
}

export function verifyInterviewPasscode(passcode: string) {
  const expected = interviewPasscodeExpected()
  if (!expected) {
    return {
      ok: false as const,
      status: 503,
      error: 'INTERVIEW_PASSCODE or EDIT_PASSCODE is not configured',
    }
  }
  if (!isSixDigitPasscode(expected)) {
    return {
      ok: false as const,
      status: 503,
      error: 'Passcode env must be a 6-digit code',
    }
  }
  if (!isSixDigitPasscode(passcode)) {
    return {
      ok: false as const,
      status: 401,
      error: 'Passcode must be exactly 6 digits',
    }
  }
  if (!safeEqualString(passcode, expected)) {
    return { ok: false as const, status: 401, error: 'Invalid passcode' }
  }
  return { ok: true as const }
}

export function issueInterviewToken(now = Date.now()) {
  const expiresAtMs = now + INTERVIEW_TOKEN_TTL_MS
  const payload = {
    scope: 'interview',
    iat: now,
    exp: expiresAtMs,
    nonce: randomBytes(8).toString('hex'),
  }
  const body = b64url(JSON.stringify(payload))
  const sig = b64url(createHmac('sha256', tokenSecret()).update(body).digest())
  return {
    token: `${body}.${sig}`,
    expiresAt: new Date(expiresAtMs).toISOString(),
    expiresAtMs,
  }
}

export function verifyInterviewToken(token: string, now = Date.now()): boolean {
  if (!token || typeof token !== 'string' || !token.includes('.')) return false
  const [body, sig] = token.split('.')
  if (!body || !sig) return false

  const expected = b64url(
    createHmac('sha256', tokenSecret()).update(body).digest(),
  )
  if (!safeEqualString(sig, expected)) return false

  let payload: { scope?: string; exp?: number }
  try {
    payload = JSON.parse(fromB64url(body).toString('utf8'))
  } catch {
    return false
  }
  if (!payload || payload.scope !== 'interview') return false
  if (typeof payload.exp !== 'number' || payload.exp < now) return false
  return true
}

// re-export helpers used by callers if needed
export { isSixDigitPasscode, safeEqualString }
