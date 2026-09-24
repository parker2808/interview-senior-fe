/**
 * Client for /api/progress and /api/auth/edit (Netlify Functions).
 */

const WRITE_TOKEN_SESSION_KEY = 'progress-write-token'
const EDIT_UNLOCK_FLAG_KEY = 'edit-mode-unlocked'
const EDIT_TOKEN_SESSION_KEY = 'edit-session-token'
const EDIT_TOKEN_EXPIRES_KEY = 'edit-session-expires'

export function progressApiUrl() {
  return new URL('/api/progress', document.baseURI).href
}

export function authEditApiUrl() {
  return new URL('/api/auth/edit', document.baseURI).href
}

export function getWriteToken() {
  try {
    return sessionStorage.getItem(WRITE_TOKEN_SESSION_KEY) || ''
  } catch {
    return ''
  }
}

export function setWriteToken(token) {
  try {
    if (token) sessionStorage.setItem(WRITE_TOKEN_SESSION_KEY, token)
    else sessionStorage.removeItem(WRITE_TOKEN_SESSION_KEY)
  } catch {
    /* ignore quota / private mode */
  }
}

export function getEditToken() {
  try {
    const token = sessionStorage.getItem(EDIT_TOKEN_SESSION_KEY) || ''
    const expires = sessionStorage.getItem(EDIT_TOKEN_EXPIRES_KEY) || ''
    if (!token) return ''
    if (expires) {
      const ms = Date.parse(expires)
      if (Number.isFinite(ms) && ms < Date.now()) {
        clearEditSession()
        return ''
      }
    }
    return token
  } catch {
    return ''
  }
}

export function setEditSession(token, expiresAt) {
  try {
    sessionStorage.setItem(EDIT_UNLOCK_FLAG_KEY, '1')
    if (token) sessionStorage.setItem(EDIT_TOKEN_SESSION_KEY, token)
    if (expiresAt) sessionStorage.setItem(EDIT_TOKEN_EXPIRES_KEY, expiresAt)
  } catch {
    /* ignore */
  }
}

export function clearEditSession() {
  try {
    sessionStorage.removeItem(EDIT_UNLOCK_FLAG_KEY)
    sessionStorage.removeItem(EDIT_TOKEN_SESSION_KEY)
    sessionStorage.removeItem(EDIT_TOKEN_EXPIRES_KEY)
  } catch {
    /* ignore */
  }
}

export function isEditUnlockedStored() {
  try {
    if (sessionStorage.getItem(EDIT_UNLOCK_FLAG_KEY) !== '1') return false
    // Flag alone is enough for UI unlock this tab; token may be absent if API skipped
    const expires = sessionStorage.getItem(EDIT_TOKEN_EXPIRES_KEY)
    if (expires) {
      const ms = Date.parse(expires)
      if (Number.isFinite(ms) && ms < Date.now()) {
        clearEditSession()
        return false
      }
    }
    return true
  } catch {
    return false
  }
}

/**
 * Verify 6-digit passcode via backend. Never compare secrets in the client.
 * @param {string} passcode
 * @returns {Promise<{ ok: true, token: string, expiresAt: string }>}
 */
export async function unlockEditMode(passcode) {
  const res = await fetch(authEditApiUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode }),
  })
  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new Error(`Non-JSON response (HTTP ${res.status})`)
  }
  if (!res.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`)
  }
  if (!data?.ok || !data?.token) {
    throw new Error('Unlock response missing token')
  }
  setEditSession(data.token, data.expiresAt || '')
  return data
}

export async function fetchCloudProgress() {
  const res = await fetch(progressApiUrl(), { cache: 'no-store' })
  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new Error(`Non-JSON response (HTTP ${res.status})`)
  }
  if (!res.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`)
  }
  return data
}

/**
 * @param {object} payload — progress JSON
 * @param {string} [token] — PROGRESS_WRITE_TOKEN or editToken
 * @param {'write-token' | 'edit-token'} [kind]
 */
export async function publishCloudProgress(payload, token, kind = 'write-token') {
  const headers = {
    'Content-Type': 'application/json',
  }
  if (kind === 'edit-token') {
    headers['x-edit-token'] = token
  } else {
    headers['x-progress-token'] = token
  }

  const res = await fetch(progressApiUrl(), {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new Error(`Non-JSON response (HTTP ${res.status})`)
  }
  if (!res.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`)
  }
  return data
}

export {
  WRITE_TOKEN_SESSION_KEY as TOKEN_SESSION_KEY,
  EDIT_UNLOCK_FLAG_KEY,
  EDIT_TOKEN_SESSION_KEY,
}
