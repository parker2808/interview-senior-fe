/**
 * Public progress API backed by Netlify Blobs.
 *
 * GET  /api/progress  — public read (no auth)
 * PUT|POST /api/progress — write; requires either:
 *   - header x-progress-token === PROGRESS_WRITE_TOKEN, or
 *   - header x-edit-token (or x-progress-token) = valid short-lived editToken
 *     from POST /api/auth/edit after EDIT_PASSCODE unlock
 *
 * Env (Netlify UI only — never commit):
 *   PROGRESS_WRITE_TOKEN — long-lived publish secret
 *   EDIT_PASSCODE — 6-digit owner unlock (used by /api/auth/edit)
 *   EDIT_TOKEN_SECRET — optional HMAC key for edit tokens
 */

import { getStore } from '@netlify/blobs'
import { safeEqualString, verifyEditToken } from '../lib/editAuth.js'

const STORE_NAME = 'study-progress'
const BLOB_KEY = 'parker'
const DAY_COUNT = 30

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'Content-Type, x-progress-token, x-edit-token',
  'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
}

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...CORS,
      ...extra,
    },
  })
}

/** Normalize / validate body to progress schema. */
function normalizePayload(raw) {
  if (!raw || typeof raw !== 'object') return null
  const completed = Array.isArray(raw.completed) ? raw.completed : null
  if (!completed) return null

  const days = []
  const seen = new Set()
  for (const n of completed) {
    const day = Number(n)
    if (!Number.isInteger(day) || day < 1 || day > DAY_COUNT) continue
    if (seen.has(day)) continue
    seen.add(day)
    days.push(day)
  }
  days.sort((a, b) => a - b)

  const payload = {
    version: 1,
    updatedAt:
      typeof raw.updatedAt === 'string' && raw.updatedAt
        ? raw.updatedAt
        : new Date().toISOString().slice(0, 10),
    owner: typeof raw.owner === 'string' && raw.owner ? raw.owner : 'Parker',
    completed: days,
  }
  if (typeof raw.note === 'string' && raw.note) payload.note = raw.note
  return payload
}

function emptyProgress() {
  return {
    version: 1,
    updatedAt: '',
    owner: 'Parker',
    completed: [],
    note: 'No cloud progress published yet.',
  }
}

/**
 * Accept PROGRESS_WRITE_TOKEN or a valid edit session token.
 */
function assertWriteAuth(req) {
  const editHeader = req.headers.get('x-edit-token') || ''
  if (editHeader && verifyEditToken(editHeader)) {
    return { ok: true, via: 'edit-token' }
  }

  const progressHeader = req.headers.get('x-progress-token') || ''
  if (progressHeader && verifyEditToken(progressHeader)) {
    return { ok: true, via: 'edit-token' }
  }

  const expected = process.env.PROGRESS_WRITE_TOKEN
  if (expected && progressHeader && safeEqualString(progressHeader, expected)) {
    return { ok: true, via: 'write-token' }
  }

  if (!expected && !process.env.EDIT_PASSCODE) {
    return {
      ok: false,
      status: 503,
      error:
        'Neither PROGRESS_WRITE_TOKEN nor EDIT_PASSCODE is configured on the site',
    }
  }

  return {
    ok: false,
    status: 401,
    error: 'Invalid or missing write auth (x-progress-token or x-edit-token)',
  }
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS })
  }

  const store = getStore({ name: STORE_NAME, consistency: 'strong' })

  if (req.method === 'GET') {
    try {
      const data = await store.get(BLOB_KEY, { type: 'json' })
      return json(data && typeof data === 'object' ? data : emptyProgress())
    } catch (err) {
      return json(
        { error: 'Failed to read progress', detail: String(err?.message || err) },
        500,
      )
    }
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    const auth = assertWriteAuth(req)
    if (!auth.ok) return json({ error: auth.error }, auth.status)

    let raw
    try {
      raw = await req.json()
    } catch {
      return json({ error: 'Body must be JSON' }, 400)
    }

    const payload = normalizePayload(raw)
    if (!payload) {
      return json(
        { error: 'Invalid schema: need { completed: number[] } (days 1–30)' },
        400,
      )
    }

    try {
      await store.setJSON(BLOB_KEY, payload)
      return json({ ok: true, progress: payload })
    } catch (err) {
      return json(
        { error: 'Failed to write progress', detail: String(err?.message || err) },
        500,
      )
    }
  }

  return json({ error: `Method ${req.method} not allowed` }, 405)
}
