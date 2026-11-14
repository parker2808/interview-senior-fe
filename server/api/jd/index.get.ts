import { activeModules } from '../../utils/jdModules'
import { telegramHandoff } from '../../utils/jdTelegram'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'private, no-store')
  return Promise.all((await activeModules()).map(async (row) => ({ ...row, telegram: await telegramHandoff(row.slug) })))
})
