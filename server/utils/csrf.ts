export function assertCsrf(event: Parameters<typeof getHeader>[0]) {
  const method = event.method.toUpperCase()
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return

  const expected = getRequestURL(event).origin
  const origin = getHeader(event, 'origin')
  if (origin) {
    if (origin !== expected) {
      throw createError({
        statusCode: 403,
        statusMessage: 'CSRF rejected',
        data: { code: 'CSRF' },
      })
    }
    return
  }

  const referer = getHeader(event, 'referer')
  if (referer) {
    try {
      if (new URL(referer).origin === expected) return
    } catch {
      /* fall through */
    }
  }

  throw createError({
    statusCode: 403,
    statusMessage: 'CSRF rejected',
    data: { code: 'CSRF' },
  })
}
