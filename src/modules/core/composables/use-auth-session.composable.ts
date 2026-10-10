import {
  fetchAuthSession,
  logoutAuthSession,
  type AuthSession,
} from '@/modules/core/services/auth-session.service'

const EMPTY_SESSION: AuthSession = {
  ok: true,
  authenticated: false,
  user: null,
}

export function useAuthSession() {
  const { loggedIn, user, ready, fetch: fetchNuxtSession, clear } =
    useUserSession()
  const requestFetch = useRequestFetch()
  const session = useState<AuthSession>('auth-session', () => ({
    ...EMPTY_SESSION,
  }))

  const mapped = computed<AuthSession>(() => ({
    ok: true,
    authenticated: Boolean(loggedIn.value && user.value),
    user: user.value
      ? {
          login: user.value.login,
          id: user.value.id,
          name: user.value.name,
          avatarUrl: user.value.avatarUrl,
        }
      : null,
  }))

  watch(
    mapped,
    (value) => {
      session.value = value
    },
    { immediate: true },
  )

  async function refresh() {
    try {
      await fetchNuxtSession()
      session.value = await fetchAuthSession(requestFetch).catch(
        () => mapped.value,
      )
    } catch {
      session.value = { ...EMPTY_SESSION }
    }
    return session.value
  }

  async function logout() {
    await logoutAuthSession(requestFetch).catch(() => {})
    await clear()
    session.value = { ...EMPTY_SESSION }
  }

  return {
    session,
    ready,
    loggedIn,
    user,
    refresh,
    logout,
  }
}
