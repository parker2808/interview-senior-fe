import { privateCacheHeaders } from '@/modules/core/utils/cache-headers.util'
import { isEnvOwner } from '@/modules/access/utils/role-resolution.util'
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

  const id = Number(getRouterParam(event, 'id'))
  const member = await store.getMemberById(id)
  if (!member) {
    throw createError({ statusCode: 404, statusMessage: 'Member not found' })
  }
  if (isEnvOwner(member, process.env)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Environment owners cannot be changed',
      data: { code: 'ENV_OWNER_LOCKED' },
    })
  }

  const body = await readBody<{
    role?: string
    note?: string
    expiresAt?: string | number | null
  }>(event).catch(() => ({}))

  let role = member.role
  if (body?.role) {
    if (body.role !== 'owner' && body.role !== 'viewer') {
      throw createError({ statusCode: 400, statusMessage: 'Role must be owner or viewer' })
    }
    role = body.role
  }

  let expiresAt = member.expiresAt
  if (body && 'expiresAt' in body) {
    if (body.expiresAt == null || body.expiresAt === '') expiresAt = null
    else {
      expiresAt = typeof body.expiresAt === 'number' ? body.expiresAt : Date.parse(String(body.expiresAt))
      if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
        throw createError({ statusCode: 400, statusMessage: 'Expiry must be in the future' })
      }
    }
  }

  const next = {
    ...member,
    role,
    note: body?.note != null ? String(body.note).slice(0, 200) : member.note,
    expiresAt,
    sessionVersion:
      role !== member.role ? member.sessionVersion + 1 : member.sessionVersion,
  }
  await store.upsertMember(next)
  await writeAudit(actorFromAccess(access), 'member.role', {
    login: next.login,
    id: next.id,
    role: next.role,
    from: member.role,
  })
  return { ok: true, member: next }
})
