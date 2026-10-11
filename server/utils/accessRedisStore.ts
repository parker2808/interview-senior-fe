import { Redis } from '@upstash/redis'
import type {
  AuditEntry,
  ShareLink,
  StoredMember,
} from '@/modules/access/types/entities/access.type'
import type { AccessStore, RateLimitHit } from '@/modules/access/utils/access-store.interface'

const MEMBERS = 'access:members'
const SHARES = 'access:shares'
const HASH_PREFIX = 'access:share-hash:'
const AUDIT = 'access:audit'
const RL_PREFIX = 'access:rl:'

function redisEnv() {
  const url =
    process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || ''
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ''
  if (!url || !token) return null
  return { url, token }
}

export function isRedisConfigured() {
  return Boolean(redisEnv())
}

export function createRedisAccessStore(): AccessStore | null {
  const env = redisEnv()
  if (!env) return null
  const redis = new Redis({ url: env.url, token: env.token })

  return {
    configured: true,

    async listMembers() {
      const raw = (await redis.hgetall<Record<string, StoredMember>>(MEMBERS)) || {}
      return Object.values(raw).sort((a, b) => a.login.localeCompare(b.login))
    },

    async getMemberById(id: number) {
      return (await redis.hget<StoredMember>(MEMBERS, String(id))) ?? null
    },

    async upsertMember(member: StoredMember) {
      await redis.hset(MEMBERS, { [String(member.id)]: member })
    },

    async removeMember(id: number) {
      await redis.hdel(MEMBERS, String(id))
    },

    async listShares() {
      const raw = (await redis.hgetall<Record<string, ShareLink>>(SHARES)) || {}
      return Object.values(raw).sort((a, b) => b.createdAt - a.createdAt)
    },

    async getShareById(id: string) {
      return (await redis.hget<ShareLink>(SHARES, id)) ?? null
    },

    async getShareByHash(hash: string) {
      const id = await redis.get<string>(`${HASH_PREFIX}${hash}`)
      if (!id) return null
      return (await redis.hget<ShareLink>(SHARES, id)) ?? null
    },

    async putShare(link: ShareLink) {
      await redis.hset(SHARES, { [link.id]: link })
      await redis.set(`${HASH_PREFIX}${link.tokenHash}`, link.id)
    },

    async appendAudit(entry: AuditEntry) {
      await redis.lpush(AUDIT, entry)
      await redis.ltrim(AUDIT, 0, 49)
    },

    async listAudit(limit = 50) {
      const rows = await redis.lrange<AuditEntry>(AUDIT, 0, Math.max(0, limit - 1))
      return rows || []
    },

    async incrRateLimit(key: string, windowMs: number): Promise<RateLimitHit> {
      const redisKey = `${RL_PREFIX}${key}`
      const count = await redis.incr(redisKey)
      if (count === 1) await redis.pexpire(redisKey, windowMs)
      const ttl = await redis.pttl(redisKey)
      const resetAt = Date.now() + Math.max(ttl > 0 ? ttl : windowMs, 1)
      return { count, resetAt }
    },
  }
}
