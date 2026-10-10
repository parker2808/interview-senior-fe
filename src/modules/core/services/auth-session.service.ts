import { toAuthApiError } from '@/modules/core/utils/api-error.util'

export type AuthUser = {
  login: string
  id: number
  name: string
  avatarUrl: string
}

export type AuthSession = {
  ok: boolean
  authenticated: boolean
  user: AuthUser | null
}

type SessionFetch = (url: string, opts?: Record<string, unknown>) => Promise<unknown>

function defaultFetch(url: string, opts?: Record<string, unknown>) {
  return $fetch(url, { credentials: 'include', ...opts })
}

export function authSessionUrl() {
  return '/api/auth/session'
}

export function authLogoutUrl() {
  return '/api/auth/logout'
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
      authenticated: Boolean(data?.authenticated && data.user),
      user: data?.user ?? null,
    }
  } catch (err) {
    throw toAuthApiError(err)
  }
}

export async function logoutAuthSession(
  requestFetch: SessionFetch = defaultFetch,
) {
  try {
    await requestFetch(authLogoutUrl(), {
      method: 'POST',
      credentials: 'include',
    })
  } catch (err) {
    throw toAuthApiError(err)
  }
}
