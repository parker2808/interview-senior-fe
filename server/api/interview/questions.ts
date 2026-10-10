import { privateCacheHeaders } from '@/modules/core/utils/cache-headers.util'
import { readInterviewBank } from '../../utils/contentStore'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, privateCacheHeaders())

  if (event.method !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: `Method ${event.method} not allowed`,
    })
  }

  const bank = await readInterviewBank()
  return {
    ok: true,
    categories: bank.categories,
    questions: bank.questions,
  }
})
