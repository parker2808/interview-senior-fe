import {
  publicCacheHeaders,
  readPlanResource,
  resolveResourceId,
} from '../../../utils/contentStore'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, publicCacheHeaders())
  const raw = getRouterParam(event, 'id') || ''
  const id = await resolveResourceId(raw)
  if (!id) {
    throw createError({
      statusCode: 404,
      statusMessage: `Unknown plan resource: ${raw}`,
    })
  }
  return readPlanResource(id)
})
