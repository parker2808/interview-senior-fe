import { isAllowedGitHubUser } from '@/modules/core/utils/github-allowlist.util'
import { privateCacheHeaders } from '@/modules/core/utils/cache-headers.util'
import { isPublicApiRequest } from '@/modules/core/utils/public-api.util'

export default defineEventHandler(async (event) => {
  const pathname = getRequestURL(event).pathname
  if (!pathname.startsWith('/api')) return
  if (isPublicApiRequest(pathname, event.method)) return

  setResponseHeaders(event, privateCacheHeaders())

  const session = await getUserSession(event)
  const user = session.user
  if (!user || !isAllowedGitHubUser(user)) {
    if (user) await clearUserSession(event)
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: {
        error: 'Sign in required',
        code: 'UNAUTHORIZED',
      },
    })
  }
})
