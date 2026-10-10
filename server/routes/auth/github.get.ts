import { isAllowedGitHubUser } from '@/modules/core/utils/github-allowlist.util'
import { sanitizeRedirectPath } from '@/modules/core/utils/safe-redirect.util'

const REDIRECT_COOKIE = 'sf_auth_redirect'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7

const oauthHandler = defineOAuthGitHubEventHandler({
  config: {
    scope: ['read:user'],
  },
  async onSuccess(event, { user }) {
    const redirect = sanitizeRedirectPath(getCookie(event, REDIRECT_COOKIE))
    deleteCookie(event, REDIRECT_COOKIE, { path: '/' })

    if (!isAllowedGitHubUser(user)) {
      const login = encodeURIComponent(String(user?.login || ''))
      return sendRedirect(event, `/auth/not-allowed?login=${login}`)
    }

    await setUserSession(
      event,
      {
        user: {
          login: user.login,
          id: Number(user.id),
          name: user.name || user.login,
          avatarUrl: user.avatar_url,
        },
        loggedInAt: Date.now(),
      },
      { maxAge: SESSION_MAX_AGE },
    )

    return sendRedirect(event, redirect)
  },
  onError(event) {
    deleteCookie(event, REDIRECT_COOKIE, { path: '/' })
    return sendRedirect(event, '/login?error=oauth')
  },
})

export default defineEventHandler((event) => {
  const query = getQuery(event)
  if (!query.code && typeof query.redirect === 'string') {
    setCookie(event, REDIRECT_COOKIE, sanitizeRedirectPath(query.redirect), {
      httpOnly: true,
      sameSite: 'lax',
      secure: !import.meta.dev,
      maxAge: 10 * 60,
      path: '/',
    })
  }
  return oauthHandler(event)
})
