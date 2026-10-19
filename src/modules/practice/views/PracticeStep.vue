<script setup lang="ts">
import AppTopBar from '@/modules/core/components/AppTopBar/AppTopBar.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'
import StepDetail from '@/modules/practice/components/StepDetail/StepDetail.vue'
import EditGateModal from '@/modules/study-plan/components/EditGateModal/EditGateModal.vue'
import { usePracticeProgress } from '@/modules/practice/composables/use-practice-progress.composable'
import PracticeSubnav from '@/modules/practice/components/PracticeSubnav/PracticeSubnav.vue'
import {
  practiceStepHref,
  usePracticeDesign,
  usePracticeDesignAvailable,
  usePracticeIndex,
  usePracticeStep,
} from '@/modules/practice/composables/use-practice-index.composable'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'
import ContentSkeleton from '@/modules/content/components/ContentSkeleton/ContentSkeleton.vue'
import ContentStatus from '@/modules/content/components/ContentStatus/ContentStatus.vue'

const props = defineProps<{
  stepId: string
}>()

const router = useRouter()
const { locale, t } = useI18n()
const lang = computed<'en' | 'vi'>(() =>
  locale.value === 'en' ? 'en' : 'vi',
)
const stepId = computed(() => props.stepId)

const {
  data: step,
  pending,
  error,
  refresh,
} = await usePracticeStep(stepId)

const { data: index } = await usePracticeIndex()
const { data: design } = await usePracticeDesign()
const { data: designAvailable } = await usePracticeDesignAvailable()

const retrying = ref(false)
async function retry() {
  retrying.value = true
  try {
    await refresh()
  } finally {
    retrying.value = false
  }
}

const {
  readOnly,
  isDone,
  toggleDone,
  modalOpen,
  unlocking,
  unlockError,
  tryUnlock,
  skipUnlock,
} = usePracticeProgress()

const adjacent = computed(() => {
  const steps = index.value?.steps ?? []
  const i = steps.findIndex((item) => item.id === stepId.value)
  return {
    prev: i > 0 ? steps[i - 1]?.id ?? null : null,
    next: i >= 0 && i < steps.length - 1 ? steps[i + 1]?.id ?? null : null,
  }
})

const notFound = computed(() => {
  const err = error.value as { statusCode?: number; status?: number } | null
  const status = Number(err?.statusCode || err?.status || 0)
  return status === 404
})

watch(
  () => props.stepId,
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
      :title="step ? pickLocale(step.title, lang) : t('practice.title')"
      :home-label="t('practice.backHub')"
      back-to="/practice"
      :back-label="t('practice.backList')"
    >
      <template #actions>
        <NuxtLink
          v-if="designAvailable"
          to="/practice/design"
          class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-elevated text-ink transition hover:border-accent hover:text-accent-ink"
          :aria-label="t('practice.openDesign')"
          :title="t('practice.openDesign')"
        >
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </NuxtLink>
        <LocaleToggle />
        <ThemeToggle />
      </template>
    </AppTopBar>

    <div class="px-4 pt-3 sm:px-6 sm:pt-5">
      <div v-if="designAvailable" class="mb-4">
        <PracticeSubnav active="steps" :design-available="true" />
      </div>
      <StepDetail
        v-if="step"
        :step="step"
        :done="isDone(step.id)"
        :read-only="readOnly"
        :prev-id="adjacent.prev"
        :next-id="adjacent.next"
        :headings="design?.headings ?? []"
        @toggle="toggleDone(step.id)"
        @prev="adjacent.prev && router.push(practiceStepHref(adjacent.prev))"
        @next="adjacent.next && router.push(practiceStepHref(adjacent.next))"
      />
      <ContentSkeleton v-else-if="pending" variant="practice-step" />
      <ContentStatus
        v-else-if="error && !notFound"
        kind="error"
        :message="t('practice.loadError')"
        :retrying="retrying"
        @retry="retry"
      />
      <ContentStatus
        v-else
        kind="empty"
        :message="t('practice.stepNotFound')"
      />
    </div>
  </div>
</template>
