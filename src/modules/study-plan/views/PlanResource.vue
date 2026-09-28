<script setup lang="ts">
import BackLink from '@/modules/core/components/BackLink/BackLink.vue'
import ResourceDoc from '@/modules/study-plan/components/ResourceDoc/ResourceDoc.vue'

const props = defineProps<{
  path: string
}>()

const router = useRouter()
const { t } = useI18n()

function openDoc(path: string) {
  if (path.startsWith('documents/')) {
    const m = path.match(/^documents\/(vi|en)\/([^/]+)\.md$/)
    if (m) {
      router.push(`/docs/${m[1]}/${m[2]}?from=plan`)
      return
    }
  }
  router.push(`/plan/doc/${encodeURIComponent(path)}`)
}

function openDocs(payload: { lang: string; slug: string; hash?: string }) {
  const hash = payload.hash ? `#${payload.hash}` : ''
  router.push(`/docs/${payload.lang}/${payload.slug}?from=plan${hash}`)
}
</script>

<template>
  <div class="mx-auto min-h-screen max-w-hub pb-10">
    <div
      class="sticky top-0 z-20 border-b border-line bg-surface/95 px-4 py-3 backdrop-blur sm:px-6"
    >
      <BackLink to="/plan" :label="t('plan.backPlan')" />
    </div>
    <div class="px-4 pt-4 sm:px-6 sm:pt-6">
      <ResourceDoc
        :path="path"
        @open-doc="openDoc"
        @open-docs="openDocs"
      />
    </div>
  </div>
</template>
