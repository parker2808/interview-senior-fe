import { evaluateShareLink, hashShareToken, isShareTokenShape } from '@/modules/access/utils/share-token.util'
import { getClientIp } from '../../utils/requestIp'
import {
  applyRateLimitHeaders,
  hitDistributedRateLimit,
} from '../../utils/distributedRateLimit'
import { getAccessStore } from '../../utils/accessStore'

export default defineEventHandler(async (event) => {
  const token = String(getRouterParam(event, 'token') || '')
  const limited = await hitDistributedRateLimit(
    `share:${getClientIp(event)}`,
    { windowMs: 15 * 60 * 1000, max: 20 },
  )
  if (!limited.ok) applyRateLimitHeaders(event, limited)

  if (!isShareTokenShape(token)) {
    return sendRedirect(event, '/share-invalid?reason=expired')
  }

  const store = getAccessStore()
  const link = await store.getShareByHash(hashShareToken(token))
  const status = evaluateShareLink(link)
  if (!link || status !== 'ok') {
    return sendRedirect(
      event,
      `/share-invalid?reason=${status === 'revoked' ? 'revoked' : status === 'max_uses' ? 'max_uses' : 'expired'}`,
    )
  }

  const next = {
    ...link,
    useCount: link.useCount + 1,
    lastUsedAt: Date.now(),
  }
  await store.putShare(next)

  const remainingMs = Math.max(60_000, link.expiresAt - Date.now())
  const maxAge = Math.min(Math.ceil(remainingMs / 1000), 60 * 60 * 24 * 7)

  await replaceUserSession(
    event,
    {
      share: {
        id: link.id,
        label: link.label,
        scope: link.scope,
        expiresAt: link.expiresAt,
      },
    },
    { maxAge },
  )

  return sendRedirect(event, '/interview')
})
