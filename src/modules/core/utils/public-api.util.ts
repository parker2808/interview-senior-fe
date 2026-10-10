function normalizePath(pathname: string) {
  const path = String(pathname || '').split('?')[0] || '/'
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1)
  return path
}

/**
 * Explicit public allowlist for `/api/**`. Everything else is default-deny.
 * New API routes stay protected until added here.
 */
export function isPublicApiRequest(pathname: string, method: string): boolean {
  const path = normalizePath(pathname)
  const verb = String(method || 'GET').toUpperCase()

  if (!path.startsWith('/api')) return true

  if (verb === 'OPTIONS') {
    return (
      isPublicApiRequest(path, 'GET') ||
      isPublicApiRequest(path, 'POST') ||
      isPublicApiRequest(path, 'DELETE')
    )
  }

  if (path === '/api/auth/session' && verb === 'GET') return true
  if (path === '/api/auth/logout' && (verb === 'POST' || verb === 'DELETE')) {
    return true
  }

  // nuxt-auth-utils sealed-session endpoints
  if (path === '/api/_auth/session' || path.startsWith('/api/_auth/')) {
    return true
  }

  if (verb === 'GET' && path.startsWith('/api/knowledge-base/')) return true
  if (verb === 'GET' && path.startsWith('/api/plan/')) return true

  return false
}
