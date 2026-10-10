import { toAuthApiError } from '@/modules/core/utils/api-error.util'

export type AuthSession = {
  ok: boolean
  interview: boolean
  edit: boolean
}

export type AuthSessionScope = 'interview' | 'edit' | 'all'

type SessionFetch = (url: string, opts?: Record<string, unknown>) => Promise<unknown>

function defaultFetch(url: string, opts?: Record<string, unknown>) {
  return $fetch(url, { credentials: 'include', ...opts })
}

export function authSessionUrl() {
  return '/api/auth/session'
}

export async function fetchAuthSession(
  requestFetch: SessionFetch = defaultFetch,
): Promise<AuthSession> {
  try {
    const data = (await requestFetch(authSessionUrl(), {
      credentials: 'include',
      cache: 'no-store',
    })) as AuthSession
    return {
      ok: true,
      interview: Boolean(data?.interview),
      edit: Boolean(data?.edit),
    }
  } catch (err) {
    throw toAuthApiError(err)
  }
}

export async function clearAuthSession(
  scope: AuthSessionScope = 'all',
  requestFetch: SessionFetch = defaultFetch,
) {
  const query = scope === 'all' ? '' : `?scope=${scope}`
  try {
    await requestFetch(`${authSessionUrl()}${query}`, {
      method: 'DELETE',
      credentials: 'include',
    })
  } catch (err) {
    throw toAuthApiError(err)
  }
}
