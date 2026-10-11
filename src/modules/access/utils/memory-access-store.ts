import type {
  AuditEntry,
  ShareLink,
  StoredMember,
} from '@/modules/access/types/entities/access.type'
import type { AccessStore, RateLimitHit } from '@/modules/access/utils/access-store.interface'

export class MemoryAccessStore implements AccessStore {
  readonly configured: boolean
  private members = new Map<number, StoredMember>()
  private shares = new Map<string, ShareLink>()
  private hashes = new Map<string, string>()
  private audit: AuditEntry[] = []
  private limits = new Map<string, { count: number; resetAt: number }>()

  constructor(configured = false) {
    this.configured = configured
  }

  async listMembers() {
    return [...this.members.values()].sort((a, b) => a.login.localeCompare(b.login))
  }

  async getMemberById(id: number) {
    return this.members.get(id) ?? null
  }

  async upsertMember(member: StoredMember) {
    this.members.set(member.id, { ...member })
  }

  async removeMember(id: number) {
    this.members.delete(id)
  }

  async listShares() {
    return [...this.shares.values()].sort((a, b) => b.createdAt - a.createdAt)
  }

  async getShareById(id: string) {
    return this.shares.get(id) ?? null
  }

  async getShareByHash(hash: string) {
    const id = this.hashes.get(hash)
    return id ? (this.shares.get(id) ?? null) : null
  }

  async putShare(link: ShareLink) {
    this.shares.set(link.id, { ...link })
    this.hashes.set(link.tokenHash, link.id)
  }

  async appendAudit(entry: AuditEntry) {
    this.audit.unshift(entry)
    this.audit = this.audit.slice(0, 50)
  }

  async listAudit(limit = 50) {
    return this.audit.slice(0, limit)
  }

  async incrRateLimit(key: string, windowMs: number): Promise<RateLimitHit> {
    const now = Date.now()
    const current = this.limits.get(key)
    if (!current || current.resetAt <= now) {
      const resetAt = now + windowMs
      this.limits.set(key, { count: 1, resetAt })
      return { count: 1, resetAt }
    }
    current.count += 1
    return { count: current.count, resetAt: current.resetAt }
  }

  reset() {
    this.members.clear()
    this.shares.clear()
    this.hashes.clear()
    this.audit = []
    this.limits.clear()
  }
}
