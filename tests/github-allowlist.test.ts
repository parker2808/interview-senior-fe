import { describe, expect, it } from 'vitest'
import { isAllowedGitHubUser, parseGitHubAllowlist } from '../src/modules/core/utils/github-allowlist.util'

const parker = { login: 'parker2808', id: 123456 }

describe('parseGitHubAllowlist', () => {
  it('defaults to parker2808 when logins env is unset', () => {
    expect(parseGitHubAllowlist({})).toEqual({
      logins: ['parker2808'],
      ids: [],
    })
  })

  it('parses comma-separated logins and ids', () => {
    expect(
      parseGitHubAllowlist({
        AUTH_ALLOWED_GITHUB_LOGINS: 'Parker2808, other',
        AUTH_ALLOWED_GITHUB_IDS: '123456, 99',
      }),
    ).toEqual({
      logins: ['parker2808', 'other'],
      ids: ['123456', '99'],
    })
  })
})

describe('isAllowedGitHubUser', () => {
  it('allows the allowlisted login when no ids are set', () => {
    expect(
      isAllowedGitHubUser(parker, { AUTH_ALLOWED_GITHUB_LOGINS: 'parker2808' }),
    ).toBe(true)
  })

  it('compares login case-insensitively', () => {
    expect(
      isAllowedGitHubUser(
        { login: 'Parker2808', id: 1 },
        { AUTH_ALLOWED_GITHUB_LOGINS: 'PARKER2808' },
      ),
    ).toBe(true)
  })

  it('rejects a different GitHub login', () => {
    expect(
      isAllowedGitHubUser(
        { login: 'octocat', id: 1 },
        { AUTH_ALLOWED_GITHUB_LOGINS: 'parker2808' },
      ),
    ).toBe(false)
  })

  it('requires both login and id when AUTH_ALLOWED_GITHUB_IDS is set', () => {
    const env = {
      AUTH_ALLOWED_GITHUB_LOGINS: 'parker2808',
      AUTH_ALLOWED_GITHUB_IDS: '123456',
    }
    expect(isAllowedGitHubUser(parker, env)).toBe(true)
    expect(isAllowedGitHubUser({ login: 'parker2808', id: 999 }, env)).toBe(false)
    expect(isAllowedGitHubUser({ login: 'octocat', id: 123456 }, env)).toBe(false)
    expect(isAllowedGitHubUser({ login: 'parker2808' }, env)).toBe(false)
  })

  it('rejects missing user data', () => {
    expect(isAllowedGitHubUser(null)).toBe(false)
    expect(isAllowedGitHubUser({ login: '' })).toBe(false)
  })
})
