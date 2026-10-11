import { privateCacheHeaders } from '@/modules/core/utils/cache-headers.util'
import { evaluateShareLink } from '@/modules/access/utils/share-token.util'
import { assertOwner, readRequestAccess } from '../../utils/accessContext'
import { getAccessStore } from '../../utils/accessStore'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, privateCacheHeaders())
  const access = await readRequestAccess(event)
  assertOwner(access)
  const store = getAccessStore()
  const links = store.configured ? await store.listShares() : []
  return {
    ok: true,
    storageConfigured: store.configured,
    shares: links.map((link) => {
      const { tokenHash: _hash, ...rest } = link
      return {
        ...rest,
        status: evaluateShareLink(link),
      }
    }),
  }
})
