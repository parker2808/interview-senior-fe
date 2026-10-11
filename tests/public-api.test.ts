import { describe, expect, it } from 'vitest'
import { isPublicApiRequest } from '../src/modules/core/utils/public-api.util'

describe('isPublicApiRequest', () => {
  it('allowlists public knowledge-base and plan reads', () => {
    expect(isPublicApiRequest('/api/knowledge-base/docs', 'GET')).toBe(true)
    expect(isPublicApiRequest('/api/knowledge-base/docs/javascript', 'GET')).toBe(
      true,
    )
    expect(isPublicApiRequest('/api/knowledge-base/search?q=hoisting', 'GET')).toBe(
      true,
    )
    expect(isPublicApiRequest('/api/plan/days', 'GET')).toBe(true)
    expect(isPublicApiRequest('/api/plan/days/1', 'GET')).toBe(true)
    expect(isPublicApiRequest('/api/plan/resources/lab', 'GET')).toBe(true)
  })

  it('allowlists session probe, logout, and nuxt-auth-utils session routes', () => {
    expect(isPublicApiRequest('/api/auth/session', 'GET')).toBe(true)
    expect(isPublicApiRequest('/api/auth/logout', 'POST')).toBe(true)
    expect(isPublicApiRequest('/api/_auth/session', 'GET')).toBe(true)
    expect(isPublicApiRequest('/api/_auth/session', 'DELETE')).toBe(true)
  })

  it('default-denies interview, progress, and unknown APIs', () => {
    expect(isPublicApiRequest('/api/interview/questions', 'GET')).toBe(false)
    expect(isPublicApiRequest('/api/progress', 'GET')).toBe(false)
    expect(isPublicApiRequest('/api/progress', 'PUT')).toBe(false)
    expect(isPublicApiRequest('/api/plan/days', 'POST')).toBe(false)
    expect(isPublicApiRequest('/api/knowledge-base/docs', 'DELETE')).toBe(false)
    expect(isPublicApiRequest('/api/auth/session', 'POST')).toBe(false)
    expect(isPublicApiRequest('/api/new-thing', 'GET')).toBe(false)
    expect(isPublicApiRequest('/api/admin/members', 'GET')).toBe(false)
    expect(isPublicApiRequest('/api/admin/shares', 'POST')).toBe(false)
  })
})
