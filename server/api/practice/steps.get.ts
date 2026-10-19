import { publicCacheHeaders, readPracticeSteps } from '../../utils/contentStore'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, publicCacheHeaders())
  return readPracticeSteps()
})
