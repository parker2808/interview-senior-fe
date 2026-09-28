import type { RouterConfig } from '@nuxt/schema'

function docsParts(path: string) {
  const m = path.match(/^\/docs\/(vi|en)\/([^/#?]+)/)
  return m ? { lang: m[1], slug: m[2] } : null
}

/**
 * Manual scroll control:
 * - same docs slug language switch → keep position (page restores)
 * - hash → leave to page logic
 * - otherwise → top (avoids sticky header covering content after nav/reload)
 */
export default {
  scrollBehavior(to, from) {
    if (to.hash) return false
    const a = docsParts(to.path)
    const b = from?.path ? docsParts(from.path) : null
    if (a && b && a.slug === b.slug && a.lang !== b.lang) return false
    return { top: 0, left: 0 }
  },
} satisfies RouterConfig
