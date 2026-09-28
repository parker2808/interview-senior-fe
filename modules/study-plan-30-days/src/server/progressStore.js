/**
 * Durable progress JSON via private Vercel Blob (single key: progress.json).
 *
 * Auth (either works; token path preferred when set):
 *   - BLOB_READ_WRITE_TOKEN — static read-write token (link store / vercel env pull)
 *   - OIDC on Vercel — BLOB_STORE_ID + VERCEL_OIDC_TOKEN when store is connected
 *
 * Do not fetch blob URLs anonymously; private stores reject unauthenticated public access.
 */
import { get, put } from '@vercel/blob'

export const PROGRESS_BLOB_PATHNAME = 'progress.json'

/** Store is private — required on put/get for Parker's Blob. */
const BLOB_ACCESS = 'private'

export function emptyProgress() {
  return {
    version: 1,
    updatedAt: '',
    owner: 'Parker',
    completed: [],
    note: 'No cloud progress published yet.',
  }
}

/**
 * Resolve SDK auth options without breaking the token path.
 * @returns {{ token?: string }}
 */
function blobAuthOptions() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (token) return { token }

  // Connected store on Vercel: SDK uses OIDC (BLOB_STORE_ID + VERCEL_OIDC_TOKEN).
  if (
    process.env.BLOB_STORE_ID ||
    process.env.VERCEL_OIDC_TOKEN ||
    process.env.VERCEL
  ) {
    return {}
  }

  const err = new Error(
    'BLOB_READ_WRITE_TOKEN is not configured (and OIDC store auth is unavailable)',
  )
  err.code = 'BLOB_TOKEN_MISSING'
  throw err
}

/**
 * @returns {Promise<object>}
 */
export async function readProgress() {
  const auth = blobAuthOptions()

  let result
  try {
    result = await get(PROGRESS_BLOB_PATHNAME, {
      access: BLOB_ACCESS,
      useCache: false,
      ...auth,
    })
  } catch (err) {
    // Missing blob → empty progress (first deploy / never published).
    if (/not found|404/i.test(String(err?.message || err))) {
      return emptyProgress()
    }
    throw err
  }

  // get() returns null when the pathname does not exist.
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

/**
 * @param {object} payload
 */
export async function writeProgress(payload) {
  const auth = blobAuthOptions()

  await put(PROGRESS_BLOB_PATHNAME, JSON.stringify(payload), {
    access: BLOB_ACCESS,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json; charset=utf-8',
    ...auth,
  })
}
