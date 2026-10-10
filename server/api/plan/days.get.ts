import { publicCacheHeaders, readPlanIndex } from '../../utils/contentStore'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, publicCacheHeaders())
  return readPlanIndex()
})
