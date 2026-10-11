import { privateCacheHeaders } from '@/modules/core/utils/cache-headers.util'
import {
  actorFromAccess,
  assertOwner,
  readRequestAccess,
  writeAudit,
} from '../../../utils/accessContext'
import { getAccessStore } from '../../../utils/accessStore'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, privateCacheHeaders())
  const access = await readRequestAccess(event)
  assertOwner(access)
  const store = getAccessStore()
  if (!store.configured) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Storage is not configured',
      data: { code: 'STORAGE_NOT_CONFIGURED' },
    })
  }

  const id = String(getRouterParam(event, 'id') || '')
  const link = await store.getShareById(id)
  if (!link) throw createError({ statusCode: 404, statusMessage: 'Share link not found' })

  const next = { ...link, revokedAt: Date.now() }
  await store.putShare(next)
  await writeAudit(actorFromAccess(access), 'share.revoke', { id: next.id })
  return { ok: true }
})
