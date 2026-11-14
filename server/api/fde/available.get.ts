import { readContentJsonOptional } from '../../utils/contentStore'

export default defineEventHandler(async () => ({
  available: Boolean(await readContentJsonOptional('fde/fde-prep.json')),
}))
