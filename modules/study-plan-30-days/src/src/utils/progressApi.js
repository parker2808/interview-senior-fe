/**
 * Client for /api/progress (Netlify Function + Blobs).
 */

const TOKEN_SESSION_KEY = 'progress-write-token'

export function progressApiUrl() {
  return new URL('/api/progress', document.baseURI).href
}

export function getWriteToken() {
  try {
    return sessionStorage.getItem(TOKEN_SESSION_KEY) || ''
  } catch {
    return ''
  }
}

export function setWriteToken(token) {
  try {
    if (token) sessionStorage.setItem(TOKEN_SESSION_KEY, token)
    else sessionStorage.removeItem(TOKEN_SESSION_KEY)
  } catch {
    /* ignore quota / private mode */
  }
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
 * @param {string} token — PROGRESS_WRITE_TOKEN value
 */
export async function publishCloudProgress(payload, token) {
  const res = await fetch(progressApiUrl(), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-progress-token': token,
    },
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

export { TOKEN_SESSION_KEY }
