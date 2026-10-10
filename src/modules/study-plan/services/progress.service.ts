import { toAuthApiError } from '@/modules/core/utils/api-error.util'

const WRITE_TOKEN_SESSION_KEY = 'progress-write-token'

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

export async function unlockEditMode(passcode: string) {
  try {
    const data = await $fetch<{
      ok?: boolean
      token?: string
      expiresAt?: string
    }>(authEditApiUrl(), {
      method: 'POST',
      credentials: 'include',
      body: { passcode },
    })
    if (!data?.ok || !data?.token) {
      throw toAuthApiError(new Error('Unlock response missing token'))
    }
    return data
  } catch (err) {
    throw toAuthApiError(err)
  }
}

export async function fetchCloudProgress() {
  try {
    return await $fetch<Record<string, unknown>>(progressApiUrl(), {
      credentials: 'include',
      cache: 'no-store',
    })
  } catch (err) {
    throw toAuthApiError(err)
  }
}

export async function publishCloudProgress(
  payload: object,
  token = '',
  kind: 'write-token' | 'edit-token' | 'cookie' = 'cookie',
) {
  const headers: Record<string, string> = {}
  if (kind === 'edit-token' && token) headers['x-edit-token'] = token
  else if (kind === 'write-token' && token) headers['x-progress-token'] = token

  try {
    return await $fetch<{ progress?: object }>(progressApiUrl(), {
      method: 'PUT',
      credentials: 'include',
      headers,
      body: payload,
    })
  } catch (err) {
    throw toAuthApiError(err)
  }
}
