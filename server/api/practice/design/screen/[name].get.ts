import { createError, getRouterParam, setResponseHeaders } from 'h3'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { publicCacheHeaders } from '../../../../utils/contentStore'

const ROOT = join(process.cwd(), '.data/content/practice/design/screens')

function mimeFor(name: string) {
  const lower = name.toLowerCase()
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  return 'application/octet-stream'
}

export default defineEventHandler((event) => {
  const raw = decodeURIComponent(String(getRouterParam(event, 'name') || ''))
  const name = raw.replace(/^\/+/, '').split(/[/\\]/).pop() || ''
  if (!name || name.includes('..')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid screen name' })
  }
  const file = join(ROOT, name)
  if (!existsSync(file)) {
    throw createError({ statusCode: 404, statusMessage: 'Screen not found' })
  }
  setResponseHeaders(event, {
    ...publicCacheHeaders(),
    'Content-Type': mimeFor(name),
  })
  return readFileSync(file)
})
