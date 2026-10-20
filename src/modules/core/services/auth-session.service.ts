import { toAuthApiError } from '@/modules/core/utils/api-error.util'
import {
  interviewAuthHeaders,
  readInterviewToken,
} from '@/modules/core/utils/interview-token.util'

export type AuthSession = {
  ok: boolean
  interview: boolean
  edit: boolean
}

export type AuthSessionScope = 'interview' | 'edit' | 'all'

export const EMPTY_AUTH_SESSION: AuthSession = {
  ok: true,
  interview: false,
  edit: false,
}

type SessionFetch = (url: string, opts?: Record<string, unknown>) => Promise<unknown>

function defaultFetch(url: string, opts?: Record<string, unknown>) {
  return $fetch(url, { credentials: 'include', ...opts })
}

/** Browser `$fetch` on the client so a new tab can send cookie + Bearer. */
export function sessionFetcher(requestFetch?: SessionFetch): SessionFetch {
  if (import.meta.client || !requestFetch) return defaultFetch
  return requestFetch
}

export function authSessionUrl() {
  return '/api/auth/session'
}

export async function fetchAuthSession(
  requestFetch: SessionFetch = defaultFetch,
  token?: string,
): Promise<AuthSession> {
  const bearer = token ?? readInterviewToken()
  try {
    const data = (await requestFetch(authSessionUrl(), {
      credentials: 'include',
      cache: 'no-store',
      headers: {
        ...interviewAuthHeaders(bearer),
      },
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
