import { issueEditToken, verifyPasscode } from '../../utils/editAuth'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store',
  })

  if (event.method === 'OPTIONS') {
    setResponseStatus(event, 204)
    return null
  }

  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: `Method ${event.method} not allowed`,
    })
  }

  let body: { passcode?: string } | null
  try {
    body = await readBody(event)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Body must be JSON' })
  }

  const passcode =
    body && typeof body.passcode === 'string' ? body.passcode.trim() : ''

  const auth = verifyPasscode(passcode)
  if (!auth.ok) {
    throw createError({
      statusCode: auth.status,
      statusMessage: auth.error,
      data: { error: auth.error },
    })
  }

  const issued = issueEditToken()
  return {
    ok: true,
    token: issued.token,
    expiresAt: issued.expiresAt,
  }
})
