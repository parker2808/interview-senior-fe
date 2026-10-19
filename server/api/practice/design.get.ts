import { publicCacheHeaders, readPracticeDesign } from '../../utils/contentStore'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, publicCacheHeaders())
  return readPracticeDesign()
})
