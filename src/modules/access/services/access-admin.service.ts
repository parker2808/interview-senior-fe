import type {
  AccessRole,
  AuditEntry,
  ShareLink,
  SharePreset,
  ShareScope,
  StoredMember,
} from '@/modules/access/types/entities/access.type'
import { toAuthApiError } from '@/modules/core/utils/api-error.util'

export type MemberRow = StoredMember & {
  source: 'env' | 'store'
  locked: boolean
}

export type ShareRow = Omit<ShareLink, 'tokenHash'> & {
  status: 'ok' | 'expired' | 'revoked' | 'max_uses'
}

export type AccessMeta = {
  ok: boolean
  storageConfigured: boolean
  envOwners: string[]
  envOwnerIds: string[]
}

export type CreatedShare = {
  ok: boolean
  share: ShareRow
  token: string
  url: string
}

type ApiFetch = (url: string, opts?: Record<string, unknown>) => Promise<unknown>

function defaultFetch(url: string, opts?: Record<string, unknown>) {
  return $fetch(url, { credentials: 'include', ...opts })
}

async function call<T>(requestFetch: ApiFetch, url: string, opts?: Record<string, unknown>) {
  try {
    return (await requestFetch(url, { credentials: 'include', ...opts })) as T
  } catch (err) {
    throw toAuthApiError(err)
  }
}

export function fetchAccessMeta(requestFetch: ApiFetch = defaultFetch) {
  return call<AccessMeta>(requestFetch, '/api/admin/meta')
}

export function fetchMembers(requestFetch: ApiFetch = defaultFetch) {
  return call<{ ok: boolean; members: MemberRow[]; storageConfigured: boolean }>(
    requestFetch,
    '/api/admin/members',
  )
}

export function addMember(
  body: {
    login: string
    role: AccessRole
    note?: string
    expiresAt?: string | number | null
  },
  requestFetch: ApiFetch = defaultFetch,
) {
  return call<{ ok: boolean; member: StoredMember }>(requestFetch, '/api/admin/members', {
    method: 'POST',
    body,
  })
}

export function patchMember(
  id: number,
  body: { role?: AccessRole; note?: string; expiresAt?: string | number | null },
  requestFetch: ApiFetch = defaultFetch,
) {
  return call<{ ok: boolean; member: StoredMember }>(
    requestFetch,
    `/api/admin/members/${id}`,
    { method: 'PATCH', body },
  )
}

export function removeMember(id: number, requestFetch: ApiFetch = defaultFetch) {
  return call<{ ok: boolean }>(requestFetch, `/api/admin/members/${id}`, {
    method: 'DELETE',
  })
}

export function fetchShares(requestFetch: ApiFetch = defaultFetch) {
  return call<{ ok: boolean; shares: ShareRow[]; storageConfigured: boolean }>(
    requestFetch,
    '/api/admin/shares',
  )
}

export function createShare(
  body: {
    label?: string
    scope: ShareScope
    preset?: SharePreset | 'custom'
    expiresAt?: string | number
    maxUses?: number | null
  },
  requestFetch: ApiFetch = defaultFetch,
) {
  return call<CreatedShare>(requestFetch, '/api/admin/shares', {
    method: 'POST',
    body,
  })
}

export function extendShare(
  id: string,
  body: { preset?: SharePreset | 'custom'; expiresAt?: string | number },
  requestFetch: ApiFetch = defaultFetch,
) {
  return call<{ ok: boolean; share: ShareRow }>(requestFetch, `/api/admin/shares/${id}`, {
    method: 'PATCH',
    body,
  })
}

export function revokeShare(id: string, requestFetch: ApiFetch = defaultFetch) {
  return call<{ ok: boolean }>(requestFetch, `/api/admin/shares/${id}`, {
    method: 'DELETE',
  })
}

export function fetchAudit(requestFetch: ApiFetch = defaultFetch) {
  return call<{ ok: boolean; entries: AuditEntry[]; storageConfigured: boolean }>(
    requestFetch,
    '/api/admin/audit',
  )
}
