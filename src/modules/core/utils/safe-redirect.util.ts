const BLOCKED_PREFIXES = ['/auth/github', '/login']

export function sanitizeRedirectPath(raw: unknown, fallback = '/'): string {
  if (typeof raw !== 'string') return fallback
  const value = raw.trim()
  if (!value.startsWith('/')) return fallback
  if (value.startsWith('//')) return fallback
  if (value.includes('://')) return fallback
  if (value.includes('\\')) return fallback

  const path = value.split('#')[0] || '/'
  const pathname = path.split('?')[0] || '/'
  if (BLOCKED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return fallback
  }
  return path
}

export function githubLoginPath(redirect = '/'): string {
  const safe = sanitizeRedirectPath(redirect)
  return `/auth/github?redirect=${encodeURIComponent(safe)}`
}
