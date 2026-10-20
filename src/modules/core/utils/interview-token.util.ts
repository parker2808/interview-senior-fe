/** Cross-tab interview session token (cookie is HttpOnly; this is the Bearer backup). */

export const INTERVIEW_TOKEN_STORAGE_KEY = 'sf_interview_token'

export type TokenStorage = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export function memoryTokenStorage(
  initial: Record<string, string> = {},
): TokenStorage & { snapshot: () => Record<string, string> } {
  const map: Record<string, string> = { ...initial }
  return {
    getItem: (key) => (Object.prototype.hasOwnProperty.call(map, key) ? map[key] : null),
    setItem: (key, value) => {
      map[key] = value
    },
    removeItem: (key) => {
      delete map[key]
    },
    snapshot: () => ({ ...map }),
  }
}

function browserLocalStorage(): TokenStorage | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const probe = '__sf_ls__'
    localStorage.setItem(probe, '1')
    localStorage.removeItem(probe)
    return localStorage
  } catch {
    return null
  }
}

export function readInterviewToken(storage: TokenStorage | null = browserLocalStorage()): string {
  if (!storage) return ''
  try {
    return String(storage.getItem(INTERVIEW_TOKEN_STORAGE_KEY) || '').trim()
  } catch {
    return ''
  }
}

export function writeInterviewToken(
  token: string,
  storage: TokenStorage | null = browserLocalStorage(),
): void {
  if (!storage) return
  const value = String(token || '').trim()
  try {
    if (!value) storage.removeItem(INTERVIEW_TOKEN_STORAGE_KEY)
    else storage.setItem(INTERVIEW_TOKEN_STORAGE_KEY, value)
  } catch {
    /* private mode / quota */
  }
}

export function clearInterviewToken(storage: TokenStorage | null = browserLocalStorage()): void {
  writeInterviewToken('', storage)
}

export function interviewAuthHeaders(
  token = readInterviewToken(),
): Record<string, string> {
  const value = String(token || '').trim()
  return value ? { Authorization: `Bearer ${value}` } : {}
}

export function isInterviewTokenStorageKey(key: string | null): boolean {
  return key === INTERVIEW_TOKEN_STORAGE_KEY
}
