/**
 * Small helpers for Vercel Node serverless handlers (req/res).
 */

export function header(req, name) {
  const raw = req.headers?.[String(name).toLowerCase()]
  if (Array.isArray(raw)) return raw[0] || ''
  return typeof raw === 'string' ? raw : ''
}

export function setCors(res, methods, extraHeaders = '') {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', methods)
  const allow = ['Content-Type', extraHeaders].filter(Boolean).join(', ')
  res.setHeader('Access-Control-Allow-Headers', allow)
}

export function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

/**
 * Vercel usually parses JSON into req.body; fall back to reading the stream.
 * @returns {Promise<object|null>}
 */
export async function readJsonBody(req) {
  if (req.body != null && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body
  }
  if (typeof req.body === 'string' && req.body) {
    return JSON.parse(req.body)
  }

  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) return null
  return JSON.parse(raw)
}
