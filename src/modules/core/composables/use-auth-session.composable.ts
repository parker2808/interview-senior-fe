import {
  EMPTY_AUTH_SESSION,
  fetchAuthSession,
  sessionFetcher,
  type AuthSession,
} from '@/modules/core/services/auth-session.service'

export function useAuthSession() {
  const requestFetch = useRequestFetch()
  const session = useState<AuthSession>('auth-session', () => ({
    ...EMPTY_AUTH_SESSION,
  }))
  const ready = useState('auth-session-ready', () => false)

  async function refresh() {
    try {
      session.value = await fetchAuthSession(sessionFetcher(requestFetch))
    } catch {
      session.value = { ...EMPTY_AUTH_SESSION }
    }
    ready.value = true
    return session.value
  }

  return { session, ready, refresh }
}
