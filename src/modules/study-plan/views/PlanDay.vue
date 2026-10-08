<script setup lang="ts">
import AppTopBar from '@/modules/core/components/AppTopBar/AppTopBar.vue'
import DayDetail from '@/modules/study-plan/components/DayDetail/DayDetail.vue'
import EditGateModal from '@/modules/study-plan/components/EditGateModal/EditGateModal.vue'
import { getDay } from '@/modules/study-plan/constants/days.constant'
import { useProgress } from '@/modules/study-plan/composables/use-progress.composable'

const props = defineProps<{
  dayNumber: number
}>()

const router = useRouter()
const { t } = useI18n()
const day = computed(() => getDay(props.dayNumber))

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
    />

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
      <p v-else class="text-ink-muted">Không tìm thấy ngày.</p>
    </div>
  </div>
</template>
