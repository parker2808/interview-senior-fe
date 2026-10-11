import { describe, expect, it } from 'vitest'
import {
  canAdmin,
  canMutate,
  isEnvOwner,
  isEnvViewer,
  parseOwnerAllowlist,
  parseViewerAllowlist,
  resolveAccess,
} from '../src/modules/access/utils/role-resolution.util'
import type { StoredMember } from '../src/modules/access/types/entities/access.type'

const parker = { login: 'parker2808', id: 38419968 }
const octocat = { login: 'octocat', id: 1 }

function member(partial: Partial<StoredMember> & Pick<StoredMember, 'id' | 'login' | 'role'>): StoredMember {
  return {
    note: '',
    expiresAt: null,
    addedAt: 1,
    addedBy: { login: 'parker2808', id: 38419968 },
    sessionVersion: 0,
    ...partial,
  }
}

describe('parseOwnerAllowlist', () => {
  it('defaults to parker2808 when owner env is unset', () => {
    expect(parseOwnerAllowlist({})).toEqual({
      logins: ['parker2808'],
      ids: [],
    })
  })

  it('parses owner logins and ids', () => {
    expect(
      parseOwnerAllowlist({
        AUTH_OWNER_GITHUB_LOGINS: 'Parker2808',
        AUTH_OWNER_GITHUB_IDS: '38419968',
      }),
    ).toEqual({
      logins: ['parker2808'],
      ids: ['38419968'],
    })
  })
})

describe('parseViewerAllowlist', () => {
  it('is empty when AUTH_ALLOWED is unset (owners come from AUTH_OWNER)', () => {
    expect(parseViewerAllowlist({})).toEqual({ logins: [], ids: [] })
  })

  it('parses fallback viewer logins', () => {
    expect(
      parseViewerAllowlist({ AUTH_ALLOWED_GITHUB_LOGINS: 'Teammate' }),
    ).toEqual({ logins: ['teammate'], ids: [] })
  })
})

describe('isEnvOwner', () => {
  it('allows the default owner login when no ids are set', () => {
    expect(isEnvOwner(parker, {})).toBe(true)
  })

  it('requires login AND id when AUTH_OWNER_GITHUB_IDS is set', () => {
    const env = {
      AUTH_OWNER_GITHUB_LOGINS: 'parker2808',
      AUTH_OWNER_GITHUB_IDS: '38419968',
    }
    expect(isEnvOwner(parker, env)).toBe(true)
    expect(isEnvOwner({ login: 'parker2808', id: 999 }, env)).toBe(false)
    expect(isEnvOwner({ login: 'octocat', id: 38419968 }, env)).toBe(false)
  })
})

describe('resolveAccess', () => {
  const env = {
    AUTH_OWNER_GITHUB_LOGINS: 'parker2808',
    AUTH_OWNER_GITHUB_IDS: '38419968',
    AUTH_ALLOWED_GITHUB_LOGINS: 'legacy-viewer',
  }

  it('resolves an env owner even if they are also stored as a viewer', () => {
    const decision = resolveAccess({
      user: parker,
      env,
      members: [member({ id: 38419968, login: 'parker2808', role: 'viewer' })],
    })
    expect(decision).toMatchObject({
      role: 'owner',
      source: 'env-owner',
      reason: 'ok',
    })
  })

  it('resolves a stored owner and stored viewer by numeric GitHub id', () => {
    expect(
      resolveAccess({
        user: octocat,
        env,
        members: [member({ id: 1, login: 'octocat', role: 'viewer' })],
      }),
    ).toMatchObject({ role: 'viewer', source: 'member', reason: 'ok' })

    expect(
      resolveAccess({
        user: { login: 'renamed-octocat', id: 1 },
        env,
        members: [member({ id: 1, login: 'octocat', role: 'owner' })],
      }),
    ).toMatchObject({ role: 'owner', source: 'member', reason: 'ok' })
  })

  it('rejects an expired stored member', () => {
    const now = 10_000
    expect(
      resolveAccess({
        user: octocat,
        env,
        now,
        members: [
          member({
            id: 1,
            login: 'octocat',
            role: 'viewer',
            expiresAt: now,
          }),
        ],
      }),
    ).toMatchObject({ role: null, reason: 'expired' })
  })

  it('invalidates a removed member and a stale session version after demotion', () => {
    expect(
      resolveAccess({
        user: octocat,
        env,
        members: [],
      }),
    ).toMatchObject({ role: null, reason: 'not-allowed' })

    expect(
      resolveAccess({
        user: octocat,
        env,
        sessionVersion: 0,
        members: [member({ id: 1, login: 'octocat', role: 'viewer', sessionVersion: 2 })],
      }),
    ).toMatchObject({ role: null, reason: 'session-stale' })
  })

  it('falls back to AUTH_ALLOWED_GITHUB_LOGINS as a viewer list', () => {
    expect(
      resolveAccess({
        user: { login: 'legacy-viewer', id: 9 },
        env,
      }),
    ).toMatchObject({ role: 'viewer', source: 'env-viewer', reason: 'ok' })
  })

  it('rejects missing user data', () => {
    expect(resolveAccess({ user: null })).toMatchObject({
      role: null,
      reason: 'missing-user',
    })
  })
})

describe('mutation and admin powers', () => {
  it('allows only owners to mutate or open admin', () => {
    expect(canMutate('owner')).toBe(true)
    expect(canAdmin('owner')).toBe(true)
    expect(canMutate('viewer')).toBe(false)
    expect(canAdmin('viewer')).toBe(false)
    expect(canMutate(null)).toBe(false)
    expect(canAdmin(null)).toBe(false)
  })

  it('does not treat a fallback env viewer as an owner', () => {
    expect(isEnvViewer({ login: 'legacy-viewer', id: 9 }, {
      AUTH_ALLOWED_GITHUB_LOGINS: 'legacy-viewer',
    })).toBe(true)
    expect(canAdmin('viewer')).toBe(false)
  })
})
