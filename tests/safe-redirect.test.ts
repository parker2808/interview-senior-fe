import { describe, expect, it } from 'vitest'
import {
  githubLoginPath,
  sanitizeRedirectPath,
} from '../src/modules/core/utils/safe-redirect.util'

describe('sanitizeRedirectPath', () => {
  it('keeps same-origin app paths', () => {
    expect(sanitizeRedirectPath('/interview')).toBe('/interview')
    expect(sanitizeRedirectPath('/plan/day/3?x=1')).toBe('/plan/day/3?x=1')
  })

  it('rejects open redirects and auth loops', () => {
    expect(sanitizeRedirectPath('https://evil.test')).toBe('/')
    expect(sanitizeRedirectPath('//evil.test')).toBe('/')
    expect(sanitizeRedirectPath('/\\evil')).toBe('/')
    expect(sanitizeRedirectPath('/auth/github')).toBe('/')
    expect(sanitizeRedirectPath('/login?redirect=/interview')).toBe('/')
  })
})

describe('githubLoginPath', () => {
  it('encodes a safe redirect onto the OAuth start URL', () => {
    expect(githubLoginPath('/interview')).toBe(
      '/auth/github?redirect=%2Finterview',
    )
  })
})
