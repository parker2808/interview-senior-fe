import { hasPracticeDesign, publicCacheHeaders } from '../../../utils/contentStore'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, publicCacheHeaders())
  return { available: await hasPracticeDesign() }
})
