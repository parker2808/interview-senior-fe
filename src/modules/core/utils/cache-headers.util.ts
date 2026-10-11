export const PUBLIC_CACHE_CONTROL =
  'public, s-maxage=86400, stale-while-revalidate=604800'

export const PRIVATE_CACHE_CONTROL = 'private, no-store'

export function publicCacheHeaders() {
  return { 'Cache-Control': PUBLIC_CACHE_CONTROL }
}

export function privateCacheHeaders() {
  return { 'Cache-Control': PRIVATE_CACHE_CONTROL }
}
