import {
  fetchAuthSession,
  type AuthSession,
} from '@/modules/core/services/auth-session.service'

const EMPTY_SESSION: AuthSession = {
  ok: true,
  interview: false,
  edit: false,
}

export function useAuthSession() {
  const requestFetch = useRequestFetch()
  const session = useState<AuthSession>('auth-session', () => ({
    ...EMPTY_SESSION,
  }))
  const ready = useState('auth-session-ready', () => false)

  async function refresh() {
    try {
      session.value = await fetchAuthSession(requestFetch)
    } catch {
      session.value = { ...EMPTY_SESSION }
    }
    ready.value = true
    return session.value
  }

  return { session, ready, refresh }
}
