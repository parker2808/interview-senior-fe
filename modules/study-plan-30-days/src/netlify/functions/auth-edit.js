/**
 * POST /api/auth/edit — unlock edit mode with a 6-digit passcode.
 *
 * Body: { "passcode": "......" }
 * Success: { ok: true, token, expiresAt }
 * Failure: 401 / 400 / 503
 *
 * Env: EDIT_PASSCODE (6-digit, Netlify UI only — never commit).
 * Optional: EDIT_TOKEN_SECRET (HMAC key for edit tokens; derived if unset).
 */

import {
  issueEditToken,
  verifyPasscode,
} from '../lib/editAuth.js'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...CORS,
    },
  })
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS })
  }

  if (req.method !== 'POST') {
    return json({ error: `Method ${req.method} not allowed` }, 405)
  }

  let body
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Body must be JSON' }, 400)
  }

  const passcode =
    body && typeof body.passcode === 'string' ? body.passcode.trim() : ''

  const auth = verifyPasscode(passcode)
  if (!auth.ok) return json({ error: auth.error }, auth.status)

  const issued = issueEditToken()
  return json({
    ok: true,
    token: issued.token,
    expiresAt: issued.expiresAt,
  })
}
