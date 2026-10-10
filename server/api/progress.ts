import {
  emptyProgress,
  readProgress,
  writeProgress,
} from '../utils/progressStore'
import { safeEqualString, verifyEditToken } from '../utils/editAuth'
import { EDIT_SESSION_COOKIE } from '../utils/sessionCookie'

const DAY_COUNT = 30

function normalizePayload(raw: unknown) {
  if (!raw || typeof raw !== 'object') return null
  const body = raw as Record<string, unknown>
  const completed = Array.isArray(body.completed) ? body.completed : null
  if (!completed) return null

  const days: number[] = []
  const seen = new Set<number>()
  for (const n of completed) {
    const day = Number(n)
    if (!Number.isInteger(day) || day < 1 || day > DAY_COUNT) continue
    if (seen.has(day)) continue
    seen.add(day)
    days.push(day)
  }
  days.sort((a, b) => a - b)

  const payload: Record<string, unknown> = {
    version: 1,
    updatedAt:
      typeof body.updatedAt === 'string' && body.updatedAt
        ? body.updatedAt
        : new Date().toISOString().slice(0, 10),
    owner: typeof body.owner === 'string' && body.owner ? body.owner : 'Parker',
    completed: days,
  }
  if (typeof body.note === 'string' && body.note) payload.note = body.note
  return payload
}

function assertWriteAuth(event: Parameters<typeof getHeader>[0]) {
  const editHeader = getHeader(event, 'x-edit-token')
  if (editHeader && verifyEditToken(editHeader)) {
    return { ok: true as const, via: 'edit-token' }
  }

  const progressHeader = getHeader(event, 'x-progress-token')
  if (progressHeader && verifyEditToken(progressHeader)) {
    return { ok: true as const, via: 'edit-token' }
  }

  const cookieToken = getCookie(event, EDIT_SESSION_COOKIE) || ''
  if (cookieToken && verifyEditToken(cookieToken)) {
    return { ok: true as const, via: 'edit-cookie' }
  }

  const expected = process.env.PROGRESS_WRITE_TOKEN
  if (expected && progressHeader && safeEqualString(progressHeader, expected)) {
    return { ok: true as const, via: 'write-token' }
  }

  if (!expected && !process.env.EDIT_PASSCODE) {
    return {
      ok: false as const,
      status: 503,
      error:
        'Neither PROGRESS_WRITE_TOKEN nor EDIT_PASSCODE is configured on the site',
    }
  }

  return {
    ok: false as const,
    status: 401,
    error:
      'Invalid or missing write auth (cookie, x-progress-token, or x-edit-token)',
  }
}

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, x-progress-token, x-edit-token',
    'Cache-Control': 'no-store',
  })

  if (event.method === 'OPTIONS') {
    setResponseStatus(event, 204)
    return null
  }

  if (event.method === 'GET') {
    try {
      const data = await readProgress()
      return data && typeof data === 'object' ? data : emptyProgress()
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code
      if (code === 'BLOB_TOKEN_MISSING') {
        throw createError({
          statusCode: 503,
          statusMessage:
            'Blob auth is not configured — create a private Vercel Blob store, link it to this project (BLOB_READ_WRITE_TOKEN or OIDC)',
        })
      }
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to read progress',
        data: { detail: String((err as Error)?.message || err) },
      })
    }
  }

  if (event.method === 'PUT' || event.method === 'POST') {
    const auth = assertWriteAuth(event)
    if (!auth.ok) {
      throw createError({ statusCode: auth.status, statusMessage: auth.error })
    }

    let raw: unknown
    try {
      raw = await readBody(event)
    } catch {
      throw createError({ statusCode: 400, statusMessage: 'Body must be JSON' })
    }

    const payload = normalizePayload(raw)
    if (!payload) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid schema: need { completed: number[] } (days 1–30)',
      })
    }

    try {
      await writeProgress(payload)
      return { ok: true, progress: payload }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code
      if (code === 'BLOB_TOKEN_MISSING') {
        throw createError({
          statusCode: 503,
          statusMessage:
            'Blob auth is not configured — create a private Vercel Blob store, link it to this project (BLOB_READ_WRITE_TOKEN or OIDC)',
        })
      }
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to write progress',
        data: { detail: String((err as Error)?.message || err) },
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: `Method ${event.method} not allowed`,
  })
})
