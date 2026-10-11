import { toAuthApiError } from '@/modules/core/utils/api-error.util'
import type { AccessRole, ShareSessionInfo } from '@/modules/access/types/entities/access.type'

export type AuthUser = {
  login: string
  id: number
  name: string
  avatarUrl: string
  role?: AccessRole | null
}

export type AuthSession = {
  ok: boolean
  authenticated: boolean
  role: AccessRole | null
  user: AuthUser | null
  share: ShareSessionInfo | null
  storageConfigured: boolean
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
      role: data?.role ?? data?.user?.role ?? null,
      user: data?.user ?? null,
      share: data?.share ?? null,
      storageConfigured: Boolean(data?.storageConfigured),
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
