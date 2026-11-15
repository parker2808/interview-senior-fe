import { activeModule } from '../../utils/jdModules'
import { moduleActionHandoff } from '../../utils/jdTelegram'
import { verifyEditToken } from '../../utils/editAuth'
import { readEditSessionToken } from '../../utils/sessionCookie'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'private, no-store')
  const slug = getRouterParam(event, 'slug') || ''
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw createError({ statusCode: 404 })
  const module = await activeModule(slug)
  if (!module) throw createError({ statusCode: 404, statusMessage: 'Module not available' })
  return { ...module, ...(slug !== 'fde' && verifyEditToken(readEditSessionToken(event)) ? { action: await moduleActionHandoff(slug, 'delete') } : {}) }
})
