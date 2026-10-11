import { privateCacheHeaders } from '@/modules/core/utils/cache-headers.util'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, privateCacheHeaders())
  await clearUserSession(event)
  return { ok: true }
})
