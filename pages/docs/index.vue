<script setup lang="ts">
import { DocsRoute } from '@/modules/knowledge-base/enums/docs-routes.enum'
import { DEFAULT_DOC_SLUG } from '@/modules/knowledge-base/constants/doc-catalog.constant'
import { DEFAULT_DOC_LANG } from '@/modules/core/constants/locale.constant'

definePageMeta({
  name: DocsRoute.Index,
})

const { locale } = useI18n()

await navigateTo(
  `/docs/${locale.value || DEFAULT_DOC_LANG}/${DEFAULT_DOC_SLUG}`,
  { replace: true },
)
</script>

<template>
  <div />
</template>
