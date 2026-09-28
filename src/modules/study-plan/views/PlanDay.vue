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
      router.push(`/docs/${m[1]}/${m[2]}`)
      return
    }
  }
  router.push(`/plan/doc/${encodeURIComponent(path)}`)
}

function openDocs(payload: { lang: string; slug: string; hash?: string }) {
  router.push(
    `/docs/${payload.lang}/${payload.slug}${payload.hash ? `#${payload.hash}` : ''}`,
  )
}
</script>

<template>
  <div class="mx-auto min-h-screen max-w-hub px-4 py-5 sm:px-6 sm:py-8">
    <EditGateModal
      :open="modalOpen"
      :unlocking="unlocking"
      :error="unlockError"
      @submit="tryUnlock"
      @skip="skipUnlock"
    />

    <div class="mb-4">
      <BackLink to="/plan" label="Danh sách ngày" />
    </div>

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
</template>
