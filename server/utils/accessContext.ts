import { randomUUID } from 'node:crypto'
import type { H3Event } from 'h3'
import type {
  AccessDecision,
  AccessRole,
  AuditAction,
  GitHubActor,
  ShareSessionInfo,
} from '@/modules/access/types/entities/access.type'
import {
  canAdmin,
  canMutate,
  resolveAccess,
} from '@/modules/access/utils/role-resolution.util'
import { getAccessStore } from './accessStore'

export type RequestAccess = AccessDecision & {
  user: {
    login: string
    id: number
    name: string
    avatarUrl: string
  } | null
  share: ShareSessionInfo | null
  storageConfigured: boolean
}

export async function readRequestAccess(event: H3Event): Promise<RequestAccess> {
  const session = await getUserSession(event)
  const store = getAccessStore()
  const members = store.configured ? await store.listMembers() : []
  const decision = resolveAccess({
    user: session.user,
    env: process.env,
    members,
    sessionVersion: session.user?.sessionVersion,
  })

  if (session.user && decision.reason === 'session-stale') {
    await clearUserSession(event)
  } else if (session.user && !decision.role) {
    await clearUserSession(event)
  }

  return {
    ...decision,
    user:
      decision.role && session.user
        ? {
            login: session.user.login,
            id: session.user.id,
            name: session.user.name,
            avatarUrl: session.user.avatarUrl,
          }
        : null,
    share: session.share ?? null,
    storageConfigured: store.configured,
  }
}

export function actorFromAccess(access: RequestAccess): GitHubActor {
  if (!access.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return { login: access.user.login, id: access.user.id }
}

export function assertOwner(access: RequestAccess) {
  if (!canAdmin(access.role)) {
    throw createError({
      statusCode: access.user || access.share ? 404 : 401,
      statusMessage: access.user || access.share ? 'Page not found' : 'Unauthorized',
      data: { code: access.user || access.share ? 'NOT_FOUND' : 'UNAUTHORIZED' },
    })
  }
}

export function assertCanMutate(access: RequestAccess) {
  if (!canMutate(access.role as AccessRole | null)) {
    throw createError({
      statusCode: access.share || access.user ? 403 : 401,
      statusMessage: access.share || access.user ? 'Forbidden' : 'Unauthorized',
      data: { code: access.share || access.user ? 'FORBIDDEN' : 'UNAUTHORIZED' },
    })
  }
}

export async function writeAudit(
  actor: GitHubActor,
  action: AuditAction,
  detail: Record<string, unknown>,
) {
  const store = getAccessStore()
  if (!store.configured) return
  await store.appendAudit({
    id: randomUUID(),
    at: Date.now(),
    actor,
    action,
    detail,
  })
}
