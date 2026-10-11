import { randomUUID } from 'node:crypto'
import { privateCacheHeaders } from '@/modules/core/utils/cache-headers.util'
import { parseShareScope } from '@/modules/access/utils/share-scope.util'
import {
  generateShareToken,
  hashShareToken,
  resolveShareExpiry,
} from '@/modules/access/utils/share-token.util'
import type { SharePreset } from '@/modules/access/types/entities/access.type'
import {
  actorFromAccess,
  assertOwner,
  readRequestAccess,
  writeAudit,
} from '../../utils/accessContext'
import { getAccessStore } from '../../utils/accessStore'

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
    label?: string
    scope?: unknown
    preset?: SharePreset | 'custom'
    expiresAt?: string | number
    maxUses?: number | null
  }>(event).catch(() => null)

  const scope = parseShareScope(body?.scope)
  if (!scope) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid share scope',
      data: { code: 'BAD_SCOPE' },
    })
  }

  const expiry = resolveShareExpiry({
    preset: body?.preset,
    expiresAt: body?.expiresAt,
  })
  if (!expiry.ok) {
    throw createError({
      statusCode: 400,
      statusMessage: expiry.error,
      data: { code: 'BAD_EXPIRY' },
    })
  }

  let maxUses: number | null = null
  if (body?.maxUses != null && body.maxUses !== ('' as unknown)) {
    const n = Number(body.maxUses)
    if (!Number.isInteger(n) || n < 1 || n > 10_000) {
      throw createError({
        statusCode: 400,
        statusMessage: 'maxUses must be a positive integer',
        data: { code: 'BAD_MAX_USES' },
      })
    }
    maxUses = n
  }

  const token = generateShareToken()
  const actor = actorFromAccess(access)
  const link = {
    id: randomUUID(),
    tokenHash: hashShareToken(token),
    label: String(body?.label || '').slice(0, 80),
    scope,
    createdAt: Date.now(),
    createdBy: actor,
    expiresAt: expiry.expiresAt,
    maxUses,
    useCount: 0,
    lastUsedAt: null,
    revokedAt: null,
  }
  await store.putShare(link)
  await writeAudit(actor, 'share.create', {
    id: link.id,
    label: link.label,
    scope: scope.type,
    expiresAt: link.expiresAt,
  })

  const origin = getRequestURL(event).origin
  return {
    ok: true,
    share: { ...link, tokenHash: undefined },
    token,
    url: `${origin}/share/${token}`,
  }
})
