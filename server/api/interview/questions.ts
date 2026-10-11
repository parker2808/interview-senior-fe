import { privateCacheHeaders } from '@/modules/core/utils/cache-headers.util'
import { filterBankByScope } from '@/modules/access/utils/share-scope.util'
import { readInterviewBank } from '../../utils/contentStore'
import { readRequestAccess } from '../../utils/accessContext'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, privateCacheHeaders())

  if (event.method !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: `Method ${event.method} not allowed`,
    })
  }

  const bank = await readInterviewBank()
  const access = await readRequestAccess(event)
  if (access.share) {
    return {
      ok: true,
      ...filterBankByScope(bank.questions, bank.categories, access.share.scope),
      share: access.share,
    }
  }

  return {
    ok: true,
    categories: bank.categories,
    questions: bank.questions,
  }
})
