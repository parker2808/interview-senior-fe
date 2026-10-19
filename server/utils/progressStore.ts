/**
 * Durable progress JSON via private Vercel Blob (single key: progress.json).
 */
import { get, put } from '@vercel/blob'

export const PROGRESS_BLOB_PATHNAME = 'progress.json'
export const PRACTICE_PROGRESS_BLOB_PATHNAME = 'practice-progress.json'

const BLOB_ACCESS = 'private' as const

export function emptyProgress() {
  return {
    version: 1,
    updatedAt: '',
    owner: 'Parker',
    completed: [] as number[],
    note: 'No cloud progress published yet.',
  }
}

export function emptyPracticeProgress() {
  return {
    version: 1,
    updatedAt: '',
    owner: 'Parker',
    completed: [] as string[],
    note: 'No cloud practice progress published yet.',
  }
}

function blobAuthOptions(): { token?: string } {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (token) return { token }

  if (
    process.env.BLOB_STORE_ID ||
    process.env.VERCEL_OIDC_TOKEN ||
    process.env.VERCEL
  ) {
    return {}
  }

  const err = new Error(
    'BLOB_READ_WRITE_TOKEN is not configured (and OIDC store auth is unavailable)',
  ) as Error & { code?: string }
  err.code = 'BLOB_TOKEN_MISSING'
  throw err
}

async function readBlobJson(pathname: string, fallback: () => object) {
  const auth = blobAuthOptions()

  let result
  try {
    result = await get(pathname, {
      access: BLOB_ACCESS,
      useCache: false,
      ...auth,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    if (/not found|404/i.test(message)) {
      return fallback()
    }
    throw err
  }

  if (!result || result.statusCode !== 200 || !result.stream) {
    return fallback()
  }

  const text = await new Response(result.stream).text()
  if (!text) return fallback()

  try {
    const data = JSON.parse(text)
    return data && typeof data === 'object' ? data : fallback()
  } catch {
    return fallback()
  }
}

async function writeBlobJson(pathname: string, payload: object) {
  const auth = blobAuthOptions()

  await put(pathname, JSON.stringify(payload), {
    access: BLOB_ACCESS,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json; charset=utf-8',
    ...auth,
  })
}

export async function readProgress() {
  return readBlobJson(PROGRESS_BLOB_PATHNAME, emptyProgress)
}

export async function writeProgress(payload: object) {
  await writeBlobJson(PROGRESS_BLOB_PATHNAME, payload)
}

export async function readPracticeProgress() {
  return readBlobJson(PRACTICE_PROGRESS_BLOB_PATHNAME, emptyPracticeProgress)
}

export async function writePracticeProgress(payload: object) {
  await writeBlobJson(PRACTICE_PROGRESS_BLOB_PATHNAME, payload)
}
