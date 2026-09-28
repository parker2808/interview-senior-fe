/**
 * Progress API backed by a **private** Vercel Blob store (key: progress.json).
 * Server auth to Blob uses BLOB_READ_WRITE_TOKEN or OIDC; clients never hit the blob URL.
 *
 * GET  /api/progress  — unauthenticated HTTP read (function loads private blob)
 * PUT|POST /api/progress — write; requires either:
 *   - header x-progress-token === PROGRESS_WRITE_TOKEN, or
 *   - header x-edit-token (or x-progress-token) = valid short-lived editToken
 *     from POST /api/auth/edit after EDIT_PASSCODE unlock
 *
 * Env (Vercel project — never commit):
 *   BLOB_READ_WRITE_TOKEN — Blob store token (or OIDC when store is connected on Vercel)
 *   PROGRESS_WRITE_TOKEN — long-lived publish secret (optional)
 *   EDIT_PASSCODE — 6-digit owner unlock (used by /api/auth/edit)
 *   EDIT_TOKEN_SECRET — optional HMAC key for edit tokens
 */

import { safeEqualString, verifyEditToken } from '../server/editAuth.js'
import { header, readJsonBody, sendJson, setCors } from '../server/http.js'
import {
  emptyProgress,
  readProgress,
  writeProgress,
} from '../server/progressStore.js'

const DAY_COUNT = 30

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

/**
 * Accept PROGRESS_WRITE_TOKEN or a valid edit session token.
 */
function assertWriteAuth(req) {
  const editHeader = header(req, 'x-edit-token')
  if (editHeader && verifyEditToken(editHeader)) {
    return { ok: true, via: 'edit-token' }
  }

  const progressHeader = header(req, 'x-progress-token')
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

function blobMissingResponse(res, err) {
  if (err?.code === 'BLOB_TOKEN_MISSING') {
    sendJson(res, 503, {
      error:
        'Blob auth is not configured — create a private Vercel Blob store, link it to this project (BLOB_READ_WRITE_TOKEN or OIDC)',
    })
    return true
  }
  return false
}

export default async function handler(req, res) {
  setCors(res, 'GET, PUT, POST, OPTIONS', 'x-progress-token, x-edit-token')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  if (req.method === 'GET') {
    try {
      const data = await readProgress()
      sendJson(res, 200, data && typeof data === 'object' ? data : emptyProgress())
    } catch (err) {
      if (blobMissingResponse(res, err)) return
      sendJson(
        res,
        500,
        { error: 'Failed to read progress', detail: String(err?.message || err) },
      )
    }
    return
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    const auth = assertWriteAuth(req)
    if (!auth.ok) {
      sendJson(res, auth.status, { error: auth.error })
      return
    }

    let raw
    try {
      raw = await readJsonBody(req)
    } catch {
      sendJson(res, 400, { error: 'Body must be JSON' })
      return
    }

    const payload = normalizePayload(raw)
    if (!payload) {
      sendJson(res, 400, {
        error: 'Invalid schema: need { completed: number[] } (days 1–30)',
      })
      return
    }

    try {
      await writeProgress(payload)
      sendJson(res, 200, { ok: true, progress: payload })
    } catch (err) {
      if (blobMissingResponse(res, err)) return
      sendJson(
        res,
        500,
        { error: 'Failed to write progress', detail: String(err?.message || err) },
      )
    }
    return
  }

  sendJson(res, 405, { error: `Method ${req.method} not allowed` })
}
