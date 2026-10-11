import { privateCacheHeaders } from '@/modules/core/utils/cache-headers.util'
import { isPublicApiRequest } from '@/modules/core/utils/public-api.util'
import {
  isAdminApiPath,
  isShareReadableApi,
} from '@/modules/access/utils/admin-paths.util'
import { canAdmin, canMutate, isMutationMethod } from '@/modules/access/utils/role-resolution.util'
import { evaluateShareLink } from '@/modules/access/utils/share-token.util'
import { readRequestAccess } from '../utils/accessContext'
import { getAccessStore } from '../utils/accessStore'
import { assertCsrf } from '../utils/csrf'

export default defineEventHandler(async (event) => {
  const pathname = getRequestURL(event).pathname
  if (!pathname.startsWith('/api')) return

  if (isPublicApiRequest(pathname, event.method)) return

  setResponseHeaders(event, privateCacheHeaders())

  if (isMutationMethod(event.method)) {
    assertCsrf(event)
  }

  const access = await readRequestAccess(event)

  if (access.share) {
    const store = getAccessStore()
    const link = await store.getShareById(access.share.id)
    const status = evaluateShareLink(link)
    if (status !== 'ok') {
      await clearUserSession(event)
      throw createError({
        statusCode: 401,
        statusMessage: 'Share link is no longer valid',
        data: { code: 'SHARE_INVALID' },
      })
    }
    if (isAdminApiPath(pathname)) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found',
        data: { code: 'NOT_FOUND' },
      })
    }
    if (isMutationMethod(event.method)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        data: { code: 'FORBIDDEN' },
      })
    }
    if (!isShareReadableApi(pathname, event.method)) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        data: { code: 'UNAUTHORIZED' },
      })
    }
    return
  }

  if (!access.role || !access.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: {
        error: 'Sign in required',
        code: 'UNAUTHORIZED',
      },
    })
  }

  if (isAdminApiPath(pathname) && !canAdmin(access.role)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page not found',
      data: { code: 'NOT_FOUND' },
    })
  }

  if (isMutationMethod(event.method) && !canMutate(access.role)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      data: { code: 'FORBIDDEN' },
    })
  }
})
