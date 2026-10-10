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
    // Locale toggle on the same KB doc must not force the window (or
    // `.docs-main`) back to top — the page restores via heading index.
    if (a && b && a.slug === b.slug) return false
    return { top: 0, left: 0 }
  },
} satisfies RouterConfig
