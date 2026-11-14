import type { FdeContent } from '@/modules/fde/types/entities/fde-content.type'
import { readContentJsonOptional } from '../../utils/contentStore'

export default defineEventHandler(async () => {
  const content = await readContentJsonOptional<FdeContent>('fde/fde-prep.json')
  if (!content) throw createError({ statusCode: 404, statusMessage: 'FDE content not available' })
  return content
})
