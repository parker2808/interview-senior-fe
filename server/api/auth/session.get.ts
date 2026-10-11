import { privateCacheHeaders } from '@/modules/core/utils/cache-headers.util'
import { evaluateShareLink } from '@/modules/access/utils/share-token.util'
import { readRequestAccess } from '../../utils/accessContext'
import { getAccessStore } from '../../utils/accessStore'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, privateCacheHeaders())
  const access = await readRequestAccess(event)

  let share = access.share
  if (share) {
    const link = await getAccessStore().getShareById(share.id)
    if (evaluateShareLink(link) !== 'ok') {
      await clearUserSession(event)
      share = null
    }
  }

  return {
    ok: true,
    authenticated: Boolean(access.user && access.role),
    role: access.user ? access.role : null,
    user: access.user,
    share,
    storageConfigured: access.storageConfigured,
  }
})
