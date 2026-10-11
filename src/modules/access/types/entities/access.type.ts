export type AccessRole = 'owner' | 'viewer'

export type GitHubActor = {
  login: string
  id: number
}

export type StoredMember = {
  id: number
  login: string
  role: AccessRole
  note: string
  expiresAt: number | null
  addedAt: number
  addedBy: GitHubActor
  sessionVersion: number
}

export type ShareScope =
  | { type: 'qa-all' }
  | { type: 'qa-categories'; categoryIds: string[] }
  | { type: 'qa-questions'; questionIds: string[] }

export type ShareLink = {
  id: string
  tokenHash: string
  label: string
  scope: ShareScope
  createdAt: number
  createdBy: GitHubActor
  expiresAt: number
  maxUses: number | null
  useCount: number
  lastUsedAt: number | null
  revokedAt: number | null
}

export type AuditAction =
  | 'member.add'
  | 'member.remove'
  | 'member.role'
  | 'share.create'
  | 'share.revoke'
  | 'share.extend'

export type AuditEntry = {
  id: string
  at: number
  actor: GitHubActor
  action: AuditAction
  detail: Record<string, unknown>
}

export type AccessDecision = {
  role: AccessRole | null
  source: 'env-owner' | 'member' | 'env-viewer' | null
  member: StoredMember | null
  reason:
    | 'ok'
    | 'missing-user'
    | 'not-allowed'
    | 'expired'
    | 'session-stale'
}

export type ShareEval = 'ok' | 'expired' | 'revoked' | 'max_uses'

export type ShareSessionInfo = {
  id: string
  label: string
  scope: ShareScope
  expiresAt: number
}

export type AccessEnv = {
  AUTH_OWNER_GITHUB_LOGINS?: string
  AUTH_OWNER_GITHUB_IDS?: string
  AUTH_ALLOWED_GITHUB_LOGINS?: string
  AUTH_ALLOWED_GITHUB_IDS?: string
}

export const DEFAULT_OWNER_LOGINS = 'parker2808'
export const SHARE_MAX_MS = 90 * 24 * 60 * 60 * 1000
export const SHARE_PRESETS_MS = {
  '1h': 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
} as const
export type SharePreset = keyof typeof SHARE_PRESETS_MS
