import type { H3Event } from 'h3'

export function getClientIp(event: H3Event) {
  const forwarded = getHeader(event, 'x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return getRequestIP(event, { xForwardedFor: true }) || 'unknown'
}
