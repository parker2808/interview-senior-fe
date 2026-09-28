/**
 * Edit-session auth helpers. Passcode lives only in EDIT_PASSCODE env.
 */
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

export const EDIT_TOKEN_TTL_MS = 12 * 60 * 60 * 1000

export function isSixDigitPasscode(value: unknown): value is string {
  return typeof value === 'string' && /^\d{6}$/.test(value)
}

export function safeEqualString(a: unknown, b: unknown): boolean {
  const left = Buffer.from(String(a ?? ''), 'utf8')
  const right = Buffer.from(String(b ?? ''), 'utf8')
  if (left.length !== right.length) {
    timingSafeEqual(left, left)
    return false
  }
  return timingSafeEqual(left, right)
}

function tokenSecret() {
  const explicit = process.env.EDIT_TOKEN_SECRET
  if (explicit) return explicit
  const pass = process.env.EDIT_PASSCODE || ''
  const write = process.env.PROGRESS_WRITE_TOKEN || ''
  return createHmac('sha256', 'study-plan-edit-v1')
    .update(`${pass}:${write}`)
    .digest('hex')
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

export function issueEditToken(now = Date.now()) {
  const expiresAtMs = now + EDIT_TOKEN_TTL_MS
  const payload = {
    scope: 'edit',
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

export function verifyEditToken(token: string, now = Date.now()): boolean {
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
  if (!payload || payload.scope !== 'edit') return false
  if (typeof payload.exp !== 'number' || payload.exp < now) return false
  return true
}

export function verifyPasscode(passcode: string) {
  const expected = process.env.EDIT_PASSCODE
  if (!expected) {
    return {
      ok: false as const,
      status: 503,
      error: 'EDIT_PASSCODE is not configured on the site',
    }
  }
  if (!isSixDigitPasscode(expected)) {
    return {
      ok: false as const,
      status: 503,
      error: 'EDIT_PASSCODE must be a 6-digit code',
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
