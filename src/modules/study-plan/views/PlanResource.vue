<script setup lang="ts">
import AppTopBar from '@/modules/core/components/AppTopBar/AppTopBar.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'
import ResourceDoc from '@/modules/study-plan/components/ResourceDoc/ResourceDoc.vue'
import { stripPlanLocalePrefix } from '@/modules/study-plan/utils/plan-locale-path.util'
import {
  docsHref,
  openInNewTab,
} from '@/modules/study-plan/utils/open-app-link.util'

const props = defineProps<{
  path: string
}>()

const router = useRouter()
const { t } = useI18n()

function openDoc(path: string) {
  const normalized = stripPlanLocalePrefix(path)
  if (normalized.startsWith('documents/')) {
    const m = normalized.match(/^documents\/(vi|en)\/([^/]+)\.md$/)
    if (m) {
      openInNewTab(docsHref(m[1], m[2]))
      return
    }
  }
  router.push(`/plan/doc/${encodeURIComponent(normalized)}`)
}

function openDocs(payload: { lang: string; slug: string; hash?: string }) {
  openInNewTab(docsHref(payload.lang, payload.slug, payload.hash))
}
</script>

<template>
  <div class="mx-auto min-h-screen max-w-hub pb-10">
    <AppTopBar
      :title="t('plan.title')"
      :home-label="t('plan.backHub')"
      back-to="/plan"
      :back-label="t('plan.backPlan')"
    >
      <template #actions>
        <LocaleToggle />
        <ThemeToggle />
      </template>
    </AppTopBar>
    <div class="px-4 pt-4 sm:px-6 sm:pt-6">
      <ResourceDoc
        :path="path"
        @open-doc="openDoc"
        @open-docs="openDocs"
      />
    </div>
  </div>
</template>
