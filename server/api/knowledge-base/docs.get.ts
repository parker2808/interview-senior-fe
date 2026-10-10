import {
  publicCacheHeaders,
  readKnowledgeCatalog,
} from '../../utils/contentStore'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, publicCacheHeaders())
  return readKnowledgeCatalog()
})
