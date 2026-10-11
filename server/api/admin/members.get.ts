import { privateCacheHeaders } from '@/modules/core/utils/cache-headers.util'
import { isEnvOwner, parseOwnerAllowlist } from '@/modules/access/utils/role-resolution.util'
import { assertOwner, readRequestAccess } from '../../utils/accessContext'
import { getAccessStore } from '../../utils/accessStore'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, privateCacheHeaders())
  const access = await readRequestAccess(event)
  assertOwner(access)

  const store = getAccessStore()
  const stored = store.configured ? await store.listMembers() : []
  const env = parseOwnerAllowlist(process.env)
  const envRows = env.logins.map((login) => ({
    id: env.ids.length === 1 ? Number(env.ids[0]) || 0 : 0,
    login,
    role: 'owner' as const,
    note: '',
    expiresAt: null,
    addedAt: 0,
    addedBy: { login: 'env', id: 0 },
    sessionVersion: 0,
    source: 'env' as const,
    locked: true,
  }))

  const storedRows = stored.map((member) => ({
    ...member,
    source: 'store' as const,
    locked: isEnvOwner(member, process.env),
  }))

  const envLogins = new Set(env.logins)
  const merged = [
    ...envRows,
    ...storedRows.filter((row) => !envLogins.has(row.login.toLowerCase())),
  ]

  return { ok: true, members: merged, storageConfigured: store.configured }
})
