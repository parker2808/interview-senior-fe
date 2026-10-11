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
      statusMessage: 'Environment owners cannot be removed',
      data: { code: 'ENV_OWNER_LOCKED' },
    })
  }

  await store.removeMember(id)
  await writeAudit(actorFromAccess(access), 'member.remove', {
    login: member.login,
    id: member.id,
  })
  return { ok: true }
})
