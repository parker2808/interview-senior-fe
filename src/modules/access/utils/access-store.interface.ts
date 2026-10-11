import type {
  AuditEntry,
  ShareLink,
  StoredMember,
} from '@/modules/access/types/entities/access.type'

export type RateLimitHit = {
  count: number
  resetAt: number
}

export interface AccessStore {
  readonly configured: boolean
  listMembers(): Promise<StoredMember[]>
  getMemberById(id: number): Promise<StoredMember | null>
  upsertMember(member: StoredMember): Promise<void>
  removeMember(id: number): Promise<void>
  listShares(): Promise<ShareLink[]>
  getShareById(id: string): Promise<ShareLink | null>
  getShareByHash(hash: string): Promise<ShareLink | null>
  putShare(link: ShareLink): Promise<void>
  appendAudit(entry: AuditEntry): Promise<void>
  listAudit(limit?: number): Promise<AuditEntry[]>
  incrRateLimit(key: string, windowMs: number): Promise<RateLimitHit>
}
