/**
 * Durable progress JSON via private Vercel Blob (single key: progress.json).
 */
import { get, put } from '@vercel/blob'

export const PROGRESS_BLOB_PATHNAME = 'progress.json'

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

export async function readProgress() {
  const auth = blobAuthOptions()

  let result
  try {
    result = await get(PROGRESS_BLOB_PATHNAME, {
      access: BLOB_ACCESS,
      useCache: false,
      ...auth,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    if (/not found|404/i.test(message)) {
      return emptyProgress()
    }
    throw err
  }

  if (!result || result.statusCode !== 200 || !result.stream) {
    return emptyProgress()
  }

  const text = await new Response(result.stream).text()
  if (!text) return emptyProgress()

  try {
    const data = JSON.parse(text)
    return data && typeof data === 'object' ? data : emptyProgress()
  } catch {
    return emptyProgress()
  }
}

export async function writeProgress(payload: object) {
  const auth = blobAuthOptions()

  await put(PROGRESS_BLOB_PATHNAME, JSON.stringify(payload), {
    access: BLOB_ACCESS,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json; charset=utf-8',
    ...auth,
  })
}
