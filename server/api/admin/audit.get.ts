import { privateCacheHeaders } from '@/modules/core/utils/cache-headers.util'
import { assertOwner, readRequestAccess } from '../../utils/accessContext'
import { getAccessStore } from '../../utils/accessStore'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, privateCacheHeaders())
  const access = await readRequestAccess(event)
  assertOwner(access)
  const store = getAccessStore()
  const entries = store.configured ? await store.listAudit(50) : []
  return { ok: true, entries, storageConfigured: store.configured }
})
