/**
 * Public progress API backed by Netlify Blobs.
 *
 * GET  /api/progress  — public read (no auth)
 * PUT|POST /api/progress — write; requires header x-progress-token === PROGRESS_WRITE_TOKEN
 *
 * Set PROGRESS_WRITE_TOKEN in Netlify Site settings → Environment variables.
 * Do not commit the real token.
 */

import { getStore } from '@netlify/blobs'

const STORE_NAME = 'study-progress'
const BLOB_KEY = 'parker'
const DAY_COUNT = 30

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, x-progress-token',
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

function assertWriteToken(req) {
  const expected = process.env.PROGRESS_WRITE_TOKEN
  if (!expected) {
    return { ok: false, status: 503, error: 'PROGRESS_WRITE_TOKEN is not configured on the site' }
  }
  const got = req.headers.get('x-progress-token') || ''
  if (got !== expected) {
    return { ok: false, status: 401, error: 'Invalid or missing x-progress-token' }
  }
  return { ok: true }
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
    const auth = assertWriteToken(req)
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
