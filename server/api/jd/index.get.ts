import { activeModules, archivedModules } from '../../utils/jdModules'
import { moduleActionHandoff, telegramHandoff } from '../../utils/jdTelegram'
import { verifyEditToken } from '../../utils/editAuth'
import { readEditSessionToken } from '../../utils/sessionCookie'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'private, no-store')
  const edit = verifyEditToken(readEditSessionToken(event))
  const archived = getQuery(event).status === 'archived'
  if (archived && !edit) return []
  return Promise.all((await (archived ? archivedModules() : activeModules())).map(async (row) => ({
    ...row,
    ...(!archived ? { telegram: await telegramHandoff(row.slug) } : {}),
    ...(edit && row.slug !== 'fde' ? { action: await moduleActionHandoff(row.slug, archived ? 'restore' : 'delete') } : {}),
  })))
})
