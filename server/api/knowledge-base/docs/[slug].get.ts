import {
  adjacentDocs,
  publicCacheHeaders,
  readKnowledgeCatalog,
  readKnowledgeDoc,
} from '../../../utils/contentStore'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, publicCacheHeaders())
  const slug = getRouterParam(event, 'slug') || ''
  const catalog = await readKnowledgeCatalog()
  const summary = catalog.docs.find((doc) => doc.slug === slug)
  if (!summary) {
    throw createError({
      statusCode: 404,
      statusMessage: `Unknown document: ${slug}`,
    })
  }
  const doc = await readKnowledgeDoc(slug)
  return {
    ...doc,
    adjacent: adjacentDocs(catalog, slug),
  }
})
