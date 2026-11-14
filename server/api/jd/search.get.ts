import { activeModules, activeModule } from '../../utils/jdModules'
import { buildFdeIndex, searchFde } from '@/modules/fde/utils/fde-search.util'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'private, no-store')
  const query = String(getQuery(event).q || '').trim().slice(0, 120)
  if (query.length < 2) return []
  const results = await Promise.all((await activeModules()).map(async (row) => {
    const module = await activeModule(row.slug)
    if (!module) return []
    return searchFde(buildFdeIndex(module.entries), query).slice(0, 30).map((hit) => ({
      slug: row.slug, moduleTitle: row.title, entry: {
        id: hit.entry.id, section: hit.entry.section, title: hit.entry.title,
        shortAnswer: hit.entry.shortAnswer,
      }, score: hit.score,
    }))
  }))
  return results.flat().sort((first, second) => second.score - first.score).slice(0, 50)
})
