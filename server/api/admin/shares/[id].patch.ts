import { privateCacheHeaders } from '@/modules/core/utils/cache-headers.util'
import {
  resolveShareExpiry,
} from '@/modules/access/utils/share-token.util'
import type { SharePreset } from '@/modules/access/types/entities/access.type'
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
  if (link.revokedAt) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Revoked links cannot be extended',
      data: { code: 'REVOKED' },
    })
  }

  const body = await readBody<{
    preset?: SharePreset | 'custom'
    expiresAt?: string | number
  }>(event).catch(() => null)
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

  const next = { ...link, expiresAt: expiry.expiresAt }
  await store.putShare(next)
  await writeAudit(actorFromAccess(access), 'share.extend', {
    id: next.id,
    expiresAt: next.expiresAt,
  })
  const { tokenHash: _hash, ...rest } = next
  return { ok: true, share: rest }
})
