import { describe, expect, it } from 'vitest'
import {
  evaluateShareLink,
  generateShareToken,
  hashShareToken,
  isShareTokenShape,
  resolveShareExpiry,
} from '../src/modules/access/utils/share-token.util'
import {
  filterBankByScope,
  parseShareScope,
  questionInScope,
} from '../src/modules/access/utils/share-scope.util'
import {
  adminAccessStatus,
  isAdminApiPath,
  isShareReadableApi,
  mutationAccessStatus,
} from '../src/modules/access/utils/admin-paths.util'
import type { ShareLink } from '../src/modules/access/types/entities/access.type'

function link(partial: Partial<ShareLink> = {}): ShareLink {
  return {
    id: 's1',
    tokenHash: 'hash',
    label: 'drill',
    scope: { type: 'qa-all' },
    createdAt: 1,
    createdBy: { login: 'parker2808', id: 38419968 },
    expiresAt: 10_000,
    maxUses: null,
    useCount: 0,
    lastUsedAt: null,
    revokedAt: null,
    ...partial,
  }
}

describe('share tokens', () => {
  it('generates a long random token and stores only a hash', () => {
    const token = generateShareToken()
    expect(token.length).toBeGreaterThanOrEqual(32)
    expect(isShareTokenShape(token)).toBe(true)
    const hash = hashShareToken(token)
    expect(hash).toHaveLength(64)
    expect(hash).not.toEqual(token)
    expect(hashShareToken(token)).toBe(hash)
    expect(hashShareToken(`${token}x`)).not.toBe(hash)
  })

  it('rejects expired, revoked, and max-use links', () => {
    const now = 5_000
    expect(evaluateShareLink(link({ expiresAt: 10_000 }), now)).toBe('ok')
    expect(evaluateShareLink(link({ expiresAt: 5_000 }), now)).toBe('expired')
    expect(evaluateShareLink(link({ revokedAt: 1 }), now)).toBe('revoked')
    expect(
      evaluateShareLink(link({ maxUses: 2, useCount: 2 }), now),
    ).toBe('max_uses')
    expect(evaluateShareLink(null, now)).toBe('expired')
  })

  it('requires a future expiry and caps at 90 days', () => {
    const now = 1_000
    expect(resolveShareExpiry({ preset: '1h', now }).ok).toBe(true)
    expect(resolveShareExpiry({ now }).ok).toBe(false)
    expect(resolveShareExpiry({ expiresAt: now, now }).ok).toBe(false)
    expect(
      resolveShareExpiry({
        preset: 'custom',
        expiresAt: now + 91 * 24 * 60 * 60 * 1000,
        now,
      }).ok,
    ).toBe(false)
  })
})

describe('share scope', () => {
  const questions = [
    { id: 'q1', category: 'technical' },
    { id: 'q2', category: 'soft' },
    { id: 'q3', category: 'situational' },
  ]
  const categories = [
    { id: 'technical' },
    { id: 'soft' },
    { id: 'situational' },
  ]

  it('parses scopes and filters the Q&A bank', () => {
    expect(parseShareScope({ type: 'qa-all' })).toEqual({ type: 'qa-all' })
    expect(parseShareScope({ type: 'qa-categories', categoryIds: [] })).toBeNull()
    expect(
      parseShareScope({ type: 'qa-questions', questionIds: ['q1'] }),
    ).toEqual({ type: 'qa-questions', questionIds: ['q1'] })

    expect(questionInScope(questions[0], { type: 'qa-all' })).toBe(true)
    const byCat = filterBankByScope(questions, categories, {
      type: 'qa-categories',
      categoryIds: ['technical'],
    })
    expect(byCat.questions.map((q) => q.id)).toEqual(['q1'])
    expect(byCat.categories.map((c) => c.id)).toEqual(['technical'])

    const byId = filterBankByScope(questions, categories, {
      type: 'qa-questions',
      questionIds: ['q2', 'q3'],
    })
    expect(byId.questions.map((q) => q.id)).toEqual(['q2', 'q3'])
  })
})

describe('viewer and share session guards', () => {
  it('hides admin APIs from non-owners and blocks their mutations', () => {
    expect(isAdminApiPath('/api/admin/members')).toBe(true)
    expect(isAdminApiPath('/api/interview/questions')).toBe(false)
    expect(adminAccessStatus('owner', true)).toBeNull()
    expect(adminAccessStatus('viewer', true)).toBe(404)
    expect(adminAccessStatus(null, false)).toBe(401)
    expect(mutationAccessStatus('owner', true)).toBeNull()
    expect(mutationAccessStatus('viewer', true)).toBe(403)
    expect(mutationAccessStatus(null, false)).toBe(401)
    expect(mutationAccessStatus(null, true)).toBe(403)
  })

  it('only allows share sessions on scoped read endpoints', () => {
    expect(isShareReadableApi('/api/interview/questions', 'GET')).toBe(true)
    expect(isShareReadableApi('/api/auth/session', 'GET')).toBe(true)
    expect(isShareReadableApi('/api/progress', 'GET')).toBe(false)
    expect(isShareReadableApi('/api/interview/questions', 'POST')).toBe(false)
    expect(isShareReadableApi('/api/admin/members', 'GET')).toBe(false)
  })
})
