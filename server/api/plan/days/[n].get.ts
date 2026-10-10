import { publicCacheHeaders, readPlanDay } from '../../../utils/contentStore'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, publicCacheHeaders())
  const n = Number(getRouterParam(event, 'n'))
  if (!Number.isInteger(n) || n < 1 || n > 30) {
    throw createError({
      statusCode: 404,
      statusMessage: `Unknown plan day: ${n}`,
    })
  }
  return readPlanDay(n)
})
