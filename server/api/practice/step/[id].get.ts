import { publicCacheHeaders, readPracticeStep } from '../../../utils/contentStore'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, publicCacheHeaders())
  const id = String(getRouterParam(event, 'id') || '')
  return readPracticeStep(id)
})
