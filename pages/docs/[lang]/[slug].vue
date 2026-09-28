<script setup lang="ts">
import DocReaderPage from '@/modules/knowledge-base/views/DocReaderPage.vue'
import { DocsRoute } from '@/modules/knowledge-base/enums/docs-routes.enum'
import { getTopic } from '@/modules/knowledge-base/constants/doc-catalog.constant'
import { DOC_LANGS } from '@/modules/core/constants/locale.constant'
import { DEFAULT_DOC_SLUG } from '@/modules/knowledge-base/constants/doc-catalog.constant'
import { DEFAULT_DOC_LANG } from '@/modules/core/constants/locale.constant'

definePageMeta({
  name: DocsRoute.Reader,
})

const route = useRoute()
const lang = String(route.params.lang || '')
const slug = String(route.params.slug || '')

if (!DOC_LANGS.includes(lang as 'vi' | 'en') || !getTopic(slug)) {
  await navigateTo(
    `/docs/${DEFAULT_DOC_LANG}/${DEFAULT_DOC_SLUG}`,
    { replace: true },
  )
}
</script>

<template>
  <DocReaderPage />
</template>
