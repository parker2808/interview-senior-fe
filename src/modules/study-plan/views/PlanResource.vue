<script setup lang="ts">
import AppTopBar from '@/modules/core/components/AppTopBar/AppTopBar.vue'
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
    <AppTopBar
      :title="t('plan.title')"
      :home-label="t('plan.backHub')"
      back-to="/plan"
      :back-label="t('plan.backPlan')"
    />
    <div class="px-4 pt-4 sm:px-6 sm:pt-6">
      <ResourceDoc
        :path="path"
        @open-doc="openDoc"
        @open-docs="openDocs"
      />
    </div>
  </div>
</template>
