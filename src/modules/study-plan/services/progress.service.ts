const WRITE_TOKEN_SESSION_KEY = 'progress-write-token'
const EDIT_UNLOCK_FLAG_KEY = 'edit-mode-unlocked'
const EDIT_TOKEN_SESSION_KEY = 'edit-session-token'
const EDIT_TOKEN_EXPIRES_KEY = 'edit-session-expires'

export function progressApiUrl() {
  return '/api/progress'
}

export function authEditApiUrl() {
  return '/api/auth/edit'
}

export function getWriteToken() {
  try {
    return sessionStorage.getItem(WRITE_TOKEN_SESSION_KEY) || ''
  } catch {
    return ''
  }
}

export function setWriteToken(token: string) {
  try {
    if (token) sessionStorage.setItem(WRITE_TOKEN_SESSION_KEY, token)
    else sessionStorage.removeItem(WRITE_TOKEN_SESSION_KEY)
  } catch {
    /* ignore */
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

export function setEditSession(token: string, expiresAt: string) {
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

export async function unlockEditMode(passcode: string) {
  const res = await fetch(authEditApiUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode }),
  })
  const text = await res.text()
  let data: { ok?: boolean; token?: string; expiresAt?: string; error?: string }
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    throw new Error(`Non-JSON response (HTTP ${res.status})`)
  }
  if (!res.ok) {
    throw new Error(
      data?.error ||
        (data as { statusMessage?: string })?.statusMessage ||
        `HTTP ${res.status}`,
    )
  }
  if (!data?.ok || !data?.token) throw new Error('Unlock response missing token')
  setEditSession(data.token, data.expiresAt || '')
  return data
}

function errorFromBody(data: unknown, status: number) {
  const body = (data || {}) as {
    error?: string
    statusMessage?: string
    message?: string
    data?: { error?: string }
  }
  return (
    body.error ||
    body.data?.error ||
    body.statusMessage ||
    body.message ||
    `HTTP ${status}`
  )
}

export async function fetchCloudProgress() {
  const res = await fetch(progressApiUrl(), { cache: 'no-store' })
  const text = await res.text()
  let data: Record<string, unknown>
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    throw new Error(`Non-JSON response (HTTP ${res.status})`)
  }
  if (!res.ok) throw new Error(errorFromBody(data, res.status))
  return data
}

export async function publishCloudProgress(
  payload: object,
  token: string,
  kind: 'write-token' | 'edit-token' = 'write-token',
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (kind === 'edit-token') headers['x-edit-token'] = token
  else headers['x-progress-token'] = token

  const res = await fetch(progressApiUrl(), {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  let data: { progress?: object }
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    throw new Error(`Non-JSON response (HTTP ${res.status})`)
  }
  if (!res.ok) throw new Error(errorFromBody(data, res.status))
  return data
}
