import { privateCacheHeaders } from '@/modules/core/utils/cache-headers.util'
import { parseOwnerAllowlist } from '@/modules/access/utils/role-resolution.util'
import { assertOwner, readRequestAccess } from '../../utils/accessContext'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, privateCacheHeaders())
  const access = await readRequestAccess(event)
  assertOwner(access)
  const owners = parseOwnerAllowlist(process.env)
  return {
    ok: true,
    storageConfigured: access.storageConfigured,
    envOwners: owners.logins,
    envOwnerIds: owners.ids,
  }
})
