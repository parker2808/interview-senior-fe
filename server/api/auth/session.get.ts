import { isAllowedGitHubUser } from '@/modules/core/utils/github-allowlist.util'
import { privateCacheHeaders } from '@/modules/core/utils/cache-headers.util'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, privateCacheHeaders())

  const session = await getUserSession(event)
  const user = session.user
  const allowed = Boolean(user && isAllowedGitHubUser(user))
  if (user && !allowed) {
    await clearUserSession(event)
  }

  return {
    ok: true,
    authenticated: allowed,
    user: allowed && user
      ? {
          login: user.login,
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
        }
      : null,
  }
})
