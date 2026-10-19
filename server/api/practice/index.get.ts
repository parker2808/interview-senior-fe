import { publicCacheHeaders, readPracticeIndex } from '../../utils/contentStore'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, publicCacheHeaders())
  return readPracticeIndex()
})
