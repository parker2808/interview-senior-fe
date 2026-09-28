<script setup lang="ts">
import BackLink from '@/modules/core/components/BackLink/BackLink.vue'
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

    <div
      class="sticky top-0 z-20 border-b border-line bg-surface/95 px-4 py-3 backdrop-blur sm:px-6"
    >
      <BackLink to="/plan" :label="t('plan.backDayList')" />
    </div>

    <div class="px-4 pt-4 sm:px-6 sm:pt-6">
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
