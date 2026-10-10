<script setup lang="ts">
import AppTopBar from '@/modules/core/components/AppTopBar/AppTopBar.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'
import DayDetail from '@/modules/study-plan/components/DayDetail/DayDetail.vue'
import EditGateModal from '@/modules/study-plan/components/EditGateModal/EditGateModal.vue'
import { useProgress } from '@/modules/study-plan/composables/use-progress.composable'
import { usePlanDay } from '@/modules/study-plan/composables/use-plan-index.composable'
import {
  planResourceHref,
} from '@/modules/study-plan/composables/use-plan-index.composable'
import {
  docsHref,
  openInNewTab,
} from '@/modules/study-plan/utils/open-app-link.util'

const props = defineProps<{
  dayNumber: number
}>()

const router = useRouter()
const { t } = useI18n()
const dayNumber = computed(() => props.dayNumber)
const { data: day } = await usePlanDay(dayNumber)

const {
  readOnly,
  isDone,
  toggleDone,
  modalOpen,
  unlocking,
  unlockError,
  tryUnlock,
  skipUnlock,
} = useProgress()

function openDoc(path: string) {
  if (path.startsWith('documents/')) {
    const m = path.match(/^documents\/(vi|en)\/([^/]+)\.md$/)
    if (m) {
      openInNewTab(docsHref(m[1], m[2]))
      return
    }
  }
  router.push(planResourceHref(path))
}

function openDocs(payload: { lang: string; slug: string; hash?: string }) {
  openInNewTab(docsHref(payload.lang, payload.slug, payload.hash))
}

watch(
  () => props.dayNumber,
  () => {
    if (import.meta.client) window.scrollTo({ top: 0, left: 0 })
  },
)

onMounted(() => {
  if (import.meta.client) window.scrollTo({ top: 0, left: 0 })
})
</script>

<template>
  <div class="mx-auto min-h-screen max-w-hub pb-10">
    <EditGateModal
      :open="modalOpen"
      :unlocking="unlocking"
      :error="unlockError"
      @submit="tryUnlock"
      @skip="skipUnlock"
    />

    <AppTopBar
      :title="day ? `Day ${String(day.day).padStart(2, '0')}` : t('plan.title')"
      :home-label="t('plan.backHub')"
      back-to="/plan"
      :back-label="t('plan.backDayList')"
    >
      <template #actions>
        <LocaleToggle />
        <ThemeToggle />
      </template>
    </AppTopBar>

    <div class="px-4 pt-3 sm:px-6 sm:pt-5">
      <DayDetail
        v-if="day"
        :day="day"
        :done="isDone(day.day)"
        :read-only="readOnly"
        @toggle="toggleDone(day.day)"
        @prev="router.push(`/plan/day/${day.day - 1}`)"
        @next="router.push(`/plan/day/${day.day + 1}`)"
        @open-doc="openDoc"
        @open-docs="openDocs"
      />
      <p v-else class="text-ink-muted">{{ t('plan.dayNotFound') }}</p>
    </div>
  </div>
</template>
