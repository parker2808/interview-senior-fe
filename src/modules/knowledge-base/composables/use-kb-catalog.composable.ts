import type { KnowledgeCatalog } from '@/modules/content/types'

export function useKbCatalog() {
  return useAsyncData(
    'kb-catalog',
    () => $fetch<KnowledgeCatalog>('/api/knowledge-base/docs'),
  )
}
