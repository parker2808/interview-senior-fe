import type { AccessRole } from '@/modules/access/types/entities/access.type'

function normalizePath(pathname: string) {
  const path = String(pathname || '').split('?')[0] || '/'
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1)
  return path
}

export function isAdminApiPath(pathname: string) {
  return normalizePath(pathname).startsWith('/api/admin/')
}

export function isShareReadableApi(pathname: string, method: string) {
  const path = normalizePath(pathname)
  const verb = method.toUpperCase()
  if (verb !== 'GET') return false
  return path === '/api/interview/questions' || path === '/api/auth/session'
}

export function isProgressWrite(pathname: string, method: string) {
  const path = normalizePath(pathname)
  const verb = method.toUpperCase()
  return path === '/api/progress' && verb !== 'GET' && verb !== 'HEAD' && verb !== 'OPTIONS'
}

/** Hide the admin module: 401 if signed out, 404 if not an owner. */
export function adminAccessStatus(
  role: AccessRole | null,
  authenticated: boolean,
): 401 | 404 | null {
  if (role === 'owner') return null
  return authenticated ? 404 : 401
}

/** Mutations are owner-only. Share sessions and viewers get 403. */
export function mutationAccessStatus(
  role: AccessRole | null,
  authenticated: boolean,
): 401 | 403 | null {
  if (role === 'owner') return null
  return authenticated ? 403 : 401
}
