import { privateCacheHeaders } from '@/modules/core/utils/cache-headers.util'
import {
  emptyProgress,
  readProgress,
  writeProgress,
} from '../utils/progressStore'

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

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, privateCacheHeaders())

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
