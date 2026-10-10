<script setup lang="ts">
import DocReaderPage from '@/modules/knowledge-base/views/DocReaderPage.vue'
import { DocsRoute } from '@/modules/knowledge-base/enums/docs-routes.enum'
import { DOC_LANGS } from '@/modules/core/constants/locale.constant'
import { DEFAULT_DOC_SLUG } from '@/modules/knowledge-base/constants/doc-catalog.constant'
import { DEFAULT_DOC_LANG } from '@/modules/core/constants/locale.constant'
import { useKbCatalog } from '@/modules/knowledge-base/composables/use-kb-catalog.composable'

definePageMeta({
  name: DocsRoute.Reader,
  key: (route) => `kb-doc-${String(route.params.slug || '')}`,
})

const route = useRoute()
const lang = String(route.params.lang || '')
const slug = String(route.params.slug || '')
const { data: catalog, error } = await useKbCatalog()

const defaultSlug = catalog.value?.defaultSlug || DEFAULT_DOC_SLUG
const known = catalog.value?.docs.some((doc) => doc.slug === slug)

if (!DOC_LANGS.includes(lang as 'vi' | 'en')) {
  await navigateTo(
    `/docs/${DEFAULT_DOC_LANG}/${slug || defaultSlug}`,
    { replace: true },
  )
} else if (!error.value && catalog.value?.docs.length && slug && !known) {
  await navigateTo(
    `/docs/${lang}/${defaultSlug}`,
    { replace: true },
  )
}
</script>

<template>
  <DocReaderPage />
</template>
