import { privateCacheHeaders } from '@/modules/core/utils/cache-headers.util'
import { isEnvOwner } from '@/modules/access/utils/role-resolution.util'
import { isGitHubLogin, normalizeGitHubLogin } from '@/modules/access/utils/github-username.util'
import {
  actorFromAccess,
  assertOwner,
  readRequestAccess,
  writeAudit,
} from '../../utils/accessContext'
import { getAccessStore } from '../../utils/accessStore'
import { lookupGitHubUser } from '../../utils/githubUserLookup'

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

  const body = await readBody<{
    login?: string
    role?: string
    note?: string
    expiresAt?: string | number | null
  }>(event).catch(() => null)
  const login = normalizeGitHubLogin(body?.login)
  if (!isGitHubLogin(login)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid GitHub username',
      data: { code: 'BAD_LOGIN' },
    })
  }
  const role = body?.role === 'owner' ? 'owner' : body?.role === 'viewer' ? 'viewer' : null
  if (!role) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Role must be owner or viewer',
      data: { code: 'BAD_ROLE' },
    })
  }

  let expiresAt: number | null = null
  if (body?.expiresAt) {
    expiresAt = typeof body.expiresAt === 'number' ? body.expiresAt : Date.parse(String(body.expiresAt))
    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Expiry must be in the future',
        data: { code: 'BAD_EXPIRY' },
      })
    }
  }

  const github = await lookupGitHubUser(login)
  if (isEnvOwner(github, process.env) && role !== 'owner') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Environment owners cannot be demoted',
      data: { code: 'ENV_OWNER_LOCKED' },
    })
  }

  const existing = await store.getMemberById(github.id)
  const actor = actorFromAccess(access)
  const member = {
    id: github.id,
    login: github.login,
    role,
    note: String(body?.note || '').slice(0, 200),
    expiresAt,
    addedAt: existing?.addedAt ?? Date.now(),
    addedBy: existing?.addedBy ?? actor,
    sessionVersion: existing?.sessionVersion ?? 0,
  }
  await store.upsertMember(member)
  await writeAudit(actor, existing ? 'member.role' : 'member.add', {
    login: member.login,
    id: member.id,
    role,
  })
  return { ok: true, member }
})
