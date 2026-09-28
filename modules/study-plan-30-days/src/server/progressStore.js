/**
 * Durable progress JSON via Vercel Blob (single key: progress.json).
 * Requires BLOB_READ_WRITE_TOKEN (auto-set when a Blob store is linked in Vercel).
 */
import { BlobNotFoundError, head, put } from '@vercel/blob'

export const PROGRESS_BLOB_PATHNAME = 'progress.json'

export function emptyProgress() {
  return {
    version: 1,
    updatedAt: '',
    owner: 'Parker',
    completed: [],
    note: 'No cloud progress published yet.',
  }
}

function blobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN || undefined
}

/**
 * @returns {Promise<object>}
 */
export async function readProgress() {
  const token = blobToken()
  if (!token) {
    const err = new Error('BLOB_READ_WRITE_TOKEN is not configured')
    err.code = 'BLOB_TOKEN_MISSING'
    throw err
  }

  let meta
  try {
    meta = await head(PROGRESS_BLOB_PATHNAME, { token })
  } catch (err) {
    // Missing blob → empty progress (first deploy / never published).
    if (err instanceof BlobNotFoundError || /not found|404/i.test(String(err?.message || err))) {
      return emptyProgress()
    }
    throw err
  }

  const res = await fetch(meta.url, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error(`Failed to fetch progress blob (HTTP ${res.status})`)
  }
  const data = await res.json()
  return data && typeof data === 'object' ? data : emptyProgress()
}

/**
 * @param {object} payload
 */
export async function writeProgress(payload) {
  const token = blobToken()
  if (!token) {
    const err = new Error('BLOB_READ_WRITE_TOKEN is not configured')
    err.code = 'BLOB_TOKEN_MISSING'
    throw err
  }

  await put(PROGRESS_BLOB_PATHNAME, JSON.stringify(payload), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json; charset=utf-8',
    token,
  })
}
