<script setup lang="ts">
import DocReaderPage from '@/modules/knowledge-base/views/DocReaderPage.vue'
import { DocsRoute } from '@/modules/knowledge-base/enums/docs-routes.enum'
import { DOC_LANGS } from '@/modules/core/constants/locale.constant'
import { DEFAULT_DOC_SLUG } from '@/modules/knowledge-base/constants/doc-catalog.constant'
import { DEFAULT_DOC_LANG } from '@/modules/core/constants/locale.constant'
import { useKbCatalog } from '@/modules/knowledge-base/composables/use-kb-catalog.composable'

definePageMeta({
  name: DocsRoute.Reader,
})

const route = useRoute()
const lang = String(route.params.lang || '')
const slug = String(route.params.slug || '')
const { data: catalog } = await useKbCatalog()

const known = catalog.value?.docs.some((doc) => doc.slug === slug)
const defaultSlug = catalog.value?.defaultSlug || DEFAULT_DOC_SLUG

if (!DOC_LANGS.includes(lang as 'vi' | 'en') || !known) {
  await navigateTo(
    `/docs/${DEFAULT_DOC_LANG}/${defaultSlug}`,
    { replace: true },
  )
}
</script>

<template>
  <DocReaderPage />
</template>
