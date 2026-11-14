import { activeModule } from '../../utils/jdModules'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'private, no-store')
  const slug = getRouterParam(event, 'slug') || ''
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw createError({ statusCode: 404 })
  const module = await activeModule(slug)
  if (!module) throw createError({ statusCode: 404, statusMessage: 'Module not available' })
  return module
})
