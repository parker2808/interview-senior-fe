const TOKEN_KEY = 'interview-session-token'
const EXPIRES_KEY = 'interview-session-expires'
const UNLOCK_FLAG = 'interview-unlocked'

export function interviewAuthUrl() {
  return '/api/auth/interview'
}

export function interviewQuestionsUrl() {
  return '/api/interview/questions'
}

export function getInterviewToken() {
  try {
    const token = sessionStorage.getItem(TOKEN_KEY) || ''
    const expires = sessionStorage.getItem(EXPIRES_KEY) || ''
    if (!token) return ''
    if (expires) {
      const ms = Date.parse(expires)
      if (Number.isFinite(ms) && ms < Date.now()) {
        clearInterviewSession()
        return ''
      }
    }
    return token
  } catch {
    return ''
  }
}

export function setInterviewSession(token: string, expiresAt: string) {
  try {
    sessionStorage.setItem(UNLOCK_FLAG, '1')
    if (token) sessionStorage.setItem(TOKEN_KEY, token)
    if (expiresAt) sessionStorage.setItem(EXPIRES_KEY, expiresAt)
  } catch {
    /* ignore */
  }
}

export function clearInterviewSession() {
  try {
    sessionStorage.removeItem(UNLOCK_FLAG)
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(EXPIRES_KEY)
  } catch {
    /* ignore */
  }
}

export function isInterviewUnlockedStored() {
  try {
    if (sessionStorage.getItem(UNLOCK_FLAG) !== '1') return false
    return Boolean(getInterviewToken())
  } catch {
    return false
  }
}

export async function unlockInterview(passcode: string) {
  const res = await fetch(interviewAuthUrl(), {
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
      (data && (data.error || (data as { statusMessage?: string }).statusMessage)) ||
        `HTTP ${res.status}`,
    )
  }
  if (!data.token) throw new Error('Missing token in response')
  setInterviewSession(data.token, data.expiresAt || '')
  return data
}

export async function fetchInterviewQuestions() {
  const token = getInterviewToken()
  if (!token) throw new Error('Not unlocked')
  const res = await fetch(interviewQuestionsUrl(), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const text = await res.text()
  let data: {
    ok?: boolean
    categories?: unknown
    questions?: unknown
    error?: string
  }
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    throw new Error(`Non-JSON response (HTTP ${res.status})`)
  }
  if (res.status === 401) {
    clearInterviewSession()
    throw new Error('Session expired')
  }
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`)
  }
  return data as {
    ok: true
    categories: import('@/modules/interview-qa/types/interview.type').InterviewCategoryMeta[]
    questions: import('@/modules/interview-qa/types/interview.type').InterviewQuestion[]
  }
}
