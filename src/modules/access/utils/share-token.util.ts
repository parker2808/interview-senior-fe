import { createHash, randomBytes } from 'node:crypto'
import type {
  ShareEval,
  ShareLink,
  SharePreset,
} from '@/modules/access/types/entities/access.type'
import {
  SHARE_MAX_MS,
  SHARE_PRESETS_MS,
} from '@/modules/access/types/entities/access.type'

export function generateShareToken() {
  return randomBytes(32).toString('base64url')
}

export function hashShareToken(token: string) {
  return createHash('sha256').update(token, 'utf8').digest('hex')
}

export function evaluateShareLink(
  link: ShareLink | null | undefined,
  now = Date.now(),
): ShareEval {
  if (!link) return 'expired'
  if (link.revokedAt) return 'revoked'
  if (link.expiresAt <= now) return 'expired'
  if (link.maxUses != null && link.useCount >= link.maxUses) return 'max_uses'
  return 'ok'
}

export function resolveShareExpiry(input: {
  preset?: SharePreset | 'custom'
  expiresAt?: number | string | null
  now?: number
}): { ok: true; expiresAt: number } | { ok: false; error: string } {
  const now = input.now ?? Date.now()
  let expiresAt = 0

  if (input.preset && input.preset !== 'custom') {
    const ms = SHARE_PRESETS_MS[input.preset]
    if (!ms) return { ok: false, error: 'Unknown expiry preset' }
    expiresAt = now + ms
  } else if (input.expiresAt != null && input.expiresAt !== '') {
    expiresAt = typeof input.expiresAt === 'number'
      ? input.expiresAt
      : Date.parse(String(input.expiresAt))
  } else {
    return { ok: false, error: 'Expiry is required' }
  }

  if (!Number.isFinite(expiresAt) || expiresAt <= now) {
    return { ok: false, error: 'Expiry must be in the future' }
  }
  if (expiresAt - now > SHARE_MAX_MS) {
    return { ok: false, error: 'Expiry cannot exceed 90 days' }
  }
  return { ok: true, expiresAt }
}

export function isShareTokenShape(token: string) {
  return /^[A-Za-z0-9_-]{32,}$/.test(token)
}
