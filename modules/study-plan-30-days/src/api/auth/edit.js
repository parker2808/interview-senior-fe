/**
 * POST /api/auth/edit — unlock edit mode with a 6-digit passcode.
 *
 * Body: { "passcode": "......" }
 * Success: { ok: true, token, expiresAt }
 * Failure: 401 / 400 / 503
 *
 * Env: EDIT_PASSCODE (6-digit, Vercel project env — never commit).
 * Optional: EDIT_TOKEN_SECRET (HMAC key for edit tokens; derived if unset).
 */

import { issueEditToken, verifyPasscode } from '../../server/editAuth.js'
import { readJsonBody, sendJson, setCors } from '../../server/http.js'

export default async function handler(req, res) {
  setCors(res, 'POST, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: `Method ${req.method} not allowed` })
    return
  }

  let body
  try {
    body = await readJsonBody(req)
  } catch {
    sendJson(res, 400, { error: 'Body must be JSON' })
    return
  }

  const passcode =
    body && typeof body.passcode === 'string' ? body.passcode.trim() : ''

  const auth = verifyPasscode(passcode)
  if (!auth.ok) {
    sendJson(res, auth.status, { error: auth.error })
    return
  }

  const issued = issueEditToken()
  sendJson(res, 200, {
    ok: true,
    token: issued.token,
    expiresAt: issued.expiresAt,
  })
}
