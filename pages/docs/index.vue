<script setup lang="ts">
import { DocsRoute } from '@/modules/knowledge-base/enums/docs-routes.enum'
import { DEFAULT_DOC_SLUG } from '@/modules/knowledge-base/constants/doc-catalog.constant'
import { DEFAULT_DOC_LANG } from '@/modules/core/constants/locale.constant'

definePageMeta({
  name: DocsRoute.Index,
})

const route = useRoute()
const { locale } = useI18n()

const lang = String(locale.value || DEFAULT_DOC_LANG)
const query = { ...route.query }

await navigateTo(
  {
    path: `/docs/${lang}/${DEFAULT_DOC_SLUG}`,
    query,
  },
  { replace: true },
)
</script>

<template>
  <div />
</template>
