import type {
  AccessDecision,
  AccessEnv,
  AccessRole,
  StoredMember,
} from '@/modules/access/types/entities/access.type'
import { DEFAULT_OWNER_LOGINS } from '@/modules/access/types/entities/access.type'
import type { GitHubIdentity } from '@/modules/core/utils/github-allowlist.util'

function splitList(value: string | undefined) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function parseOwnerAllowlist(env: AccessEnv = {}) {
  const raw = env.AUTH_OWNER_GITHUB_LOGINS
  const logins = splitList(
    raw == null || raw.trim() === '' ? DEFAULT_OWNER_LOGINS : raw,
  ).map((login) => login.toLowerCase())
  return {
    logins,
    ids: splitList(env.AUTH_OWNER_GITHUB_IDS),
  }
}

/** Fallback viewer list. Empty when unset — owners come from AUTH_OWNER_*. */
export function parseViewerAllowlist(env: AccessEnv = {}) {
  return {
    logins: splitList(env.AUTH_ALLOWED_GITHUB_LOGINS).map((login) =>
      login.toLowerCase(),
    ),
    ids: splitList(env.AUTH_ALLOWED_GITHUB_IDS),
  }
}

function matchesAllowlist(
  user: { login: string; id: string },
  list: { logins: string[]; ids: string[] },
) {
  if (!user.login || !list.logins.includes(user.login)) return false
  if (list.ids.length === 0) return true
  return Boolean(user.id) && list.ids.includes(user.id)
}

export function normalizeIdentity(user: GitHubIdentity | null | undefined) {
  const login = String(user?.login || '')
    .trim()
    .toLowerCase()
  const id = String(user?.id ?? '').trim()
  const numericId = Number(user?.id)
  return {
    login,
    id,
    numericId: Number.isInteger(numericId) && numericId > 0 ? numericId : 0,
  }
}

export function isEnvOwner(
  user: GitHubIdentity | null | undefined,
  env: AccessEnv = {},
) {
  const identity = normalizeIdentity(user)
  if (!identity.login) return false
  return matchesAllowlist(identity, parseOwnerAllowlist(env))
}

export function isEnvViewer(
  user: GitHubIdentity | null | undefined,
  env: AccessEnv = {},
) {
  const identity = normalizeIdentity(user)
  if (!identity.login) return false
  return matchesAllowlist(identity, parseViewerAllowlist(env))
}

export function findStoredMember(
  user: GitHubIdentity | null | undefined,
  members: StoredMember[],
) {
  const identity = normalizeIdentity(user)
  if (!identity.numericId) return null
  return members.find((member) => member.id === identity.numericId) ?? null
}

export function resolveAccess(input: {
  user: GitHubIdentity | null | undefined
  env?: AccessEnv
  members?: StoredMember[]
  sessionVersion?: number | null
  now?: number
}): AccessDecision {
  const env = input.env ?? {}
  const members = input.members ?? []
  const now = input.now ?? Date.now()
  const identity = normalizeIdentity(input.user)

  if (!identity.login) {
    return {
      role: null,
      source: null,
      member: null,
      reason: 'missing-user',
    }
  }

  if (isEnvOwner(input.user, env)) {
    return { role: 'owner', source: 'env-owner', member: null, reason: 'ok' }
  }

  const member = findStoredMember(input.user, members)
  if (member) {
    if (member.expiresAt && member.expiresAt <= now) {
      return { role: null, source: null, member, reason: 'expired' }
    }
    if (
      input.sessionVersion != null &&
      input.sessionVersion !== member.sessionVersion
    ) {
      return { role: null, source: null, member, reason: 'session-stale' }
    }
    return { role: member.role, source: 'member', member, reason: 'ok' }
  }

  if (isEnvViewer(input.user, env)) {
    return { role: 'viewer', source: 'env-viewer', member: null, reason: 'ok' }
  }

  return { role: null, source: null, member: null, reason: 'not-allowed' }
}

export function canMutate(role: AccessRole | null) {
  return role === 'owner'
}

export function canAdmin(role: AccessRole | null) {
  return role === 'owner'
}

export function isMutationMethod(method: string) {
  const verb = method.toUpperCase()
  return verb !== 'GET' && verb !== 'HEAD' && verb !== 'OPTIONS'
}
