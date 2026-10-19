<script setup lang="ts">
import AppTopBar from '@/modules/core/components/AppTopBar/AppTopBar.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'
import MilestoneList from '@/modules/practice/components/MilestoneList/MilestoneList.vue'
import ProgressTools from '@/modules/study-plan/components/ProgressTools/ProgressTools.vue'
import EditGateModal from '@/modules/study-plan/components/EditGateModal/EditGateModal.vue'
import { usePracticeProgress } from '@/modules/practice/composables/use-practice-progress.composable'
import PracticeSubnav from '@/modules/practice/components/PracticeSubnav/PracticeSubnav.vue'
import {
  practiceStepHref,
  usePracticeDesignAvailable,
  usePracticeIndex,
  usePracticeSteps,
} from '@/modules/practice/composables/use-practice-index.composable'
import { filterPracticeSteps } from '@/modules/practice/utils/practice-search.util'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'
import ContentSkeleton from '@/modules/content/components/ContentSkeleton/ContentSkeleton.vue'
import ContentStatus from '@/modules/content/components/ContentStatus/ContentStatus.vue'

const router = useRouter()
const { locale } = useI18n()
const lang = computed<'en' | 'vi'>(() =>
  locale.value === 'en' ? 'en' : 'vi',
)

const {
  data: index,
  pending,
  error,
  refresh,
} = await usePracticeIndex()

const { data: allSteps, pending: stepsPending } = await usePracticeSteps()
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
  source,
  readOnly,
  isEditMode,
  modeLabel,
  modalOpen,
  unlocking,
  unlockError,
  publicMeta,
  statusMessage,
  completedCount,
  percent,
  isDone,
  toggleDone,
  milestoneStats,
  nextUnfinishedId,
  useLocal,
  loadPublicProgress,
  loadCloudProgress,
  publishToCloud,
  copyShareLink,
  exportJson,
  importJsonFile,
  tryUnlock,
  skipUnlock,
  openUnlockModal,
} = usePracticeProgress()

const query = ref('')

const filteredSteps = computed(() => {
  const full = allSteps.value
  if (full?.length) {
    return filterPracticeSteps(full, { query: query.value, lang: lang.value })
  }
  return index.value?.steps ?? []
})

const searching = computed(
  () => Boolean(query.value.trim()) && stepsPending.value && !allSteps.value,
)

const notFound = computed(() => {
  const err = error.value as { statusCode?: number; status?: number } | null
  const status = Number(err?.statusCode || err?.status || 0)
  return status === 404
})

function openStep(id: string) {
  router.push(practiceStepHref(id))
}

function continueStep() {
  const id = nextUnfinishedId()
  if (id) openStep(id)
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

    <AppTopBar
      :title="$t('practice.title')"
      :home-label="$t('practice.backHub')"
    >
      <template #actions>
        <NuxtLink
          v-if="designAvailable"
          to="/practice/design"
          class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-elevated text-ink transition hover:border-accent hover:text-accent-ink"
          :aria-label="$t('practice.openDesign')"
          :title="$t('practice.openDesign')"
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
        <a
          href="/docs"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-elevated text-ink transition hover:border-accent hover:text-accent-ink"
          :aria-label="$t('practice.openDocs')"
          :title="$t('practice.openDocs')"
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
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </a>
        <LocaleToggle />
        <ThemeToggle />
      </template>
    </AppTopBar>

    <ContentSkeleton
      v-if="pending && !index"
      variant="practice-home"
      class="px-4 pt-5 sm:px-6 sm:pt-8"
    />
    <ContentStatus
      v-else-if="error && !notFound"
      class="mx-4 mt-5 sm:mx-6"
      kind="error"
      :message="$t('practice.loadError')"
      :retrying="retrying"
      @retry="retry"
    />
    <ContentStatus
      v-else-if="!index?.steps.length"
      class="mx-4 mt-5 sm:mx-6"
      kind="empty"
      :message="$t('practice.empty')"
    />
    <div v-else class="animate-fade-up px-4 pt-5 sm:px-6 sm:pt-8">
      <header class="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase tracking-wider text-accent-ink">
            {{ $t('practice.eyebrow') }}
          </p>
          <h1 class="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {{ pickLocale(index.title, lang) }}
          </h1>
          <p class="mt-2 max-w-3xl text-sm leading-6 text-ink-muted">
            {{ pickLocale(index.intro, lang) }}
          </p>
          <div class="mt-3">
            <PracticeSubnav active="steps" :design-available="Boolean(designAvailable)" />
          </div>
          <div class="mt-3 flex flex-wrap items-center gap-2">
            <span
              class="rounded-full px-2.5 py-1 text-xs font-semibold"
              :class="
                isEditMode
                  ? 'bg-done-soft text-done'
                  : 'bg-accent-soft text-accent-ink'
              "
            >
              {{ modeLabel }}
            </span>
            <button
              v-if="!isEditMode"
              type="button"
              class="text-sm font-semibold text-accent-ink underline"
              @click="openUnlockModal"
            >
              {{ $t('plan.unlock') }}
            </button>
          </div>
        </div>

        <div class="flex flex-col items-stretch gap-3 sm:items-end">
          <div class="min-w-[10rem]">
            <div class="mb-1 flex justify-between text-sm font-semibold">
              <span>{{ completedCount }}/{{ index.steps.length }}</span>
              <span>{{ percent }}%</span>
            </div>
            <div
              class="h-2 overflow-hidden rounded-full bg-line"
              role="progressbar"
              :aria-valuenow="percent"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                class="h-full rounded-full bg-accent transition-all"
                :style="{ width: `${percent}%` }"
              />
            </div>
          </div>
          <button
            v-if="nextUnfinishedId()"
            type="button"
            class="min-h-11 rounded-lg bg-accent px-4 text-sm font-semibold text-[var(--bg-elevated)] transition hover:opacity-90"
            @click="continueStep"
          >
            {{ $t('practice.continue') }}
          </button>
          <p v-else class="text-sm font-semibold text-done">
            {{ $t('practice.continueDone') }}
          </p>
        </div>
      </header>

      <div class="mt-4">
        <ProgressTools
          :source="source"
          :read-only="readOnly"
          :is-edit-mode="isEditMode"
          :status-message="statusMessage"
          :public-meta="publicMeta"
          @use-local="useLocal"
          @load-public="loadPublicProgress"
          @load-cloud="loadCloudProgress"
          @publish-cloud="publishToCloud"
          @copy-share="copyShareLink"
          @export="exportJson"
          @import-file="importJsonFile"
          @request-unlock="openUnlockModal"
        />
      </div>

      <div class="mt-4">
        <label class="sr-only" for="practice-search">{{ $t('practice.searchPlaceholder') }}</label>
        <input
          id="practice-search"
          v-model="query"
          type="search"
          class="min-h-11 w-full rounded-lg border border-line bg-surface-elevated px-3 text-sm text-ink outline-none focus:border-accent"
          :placeholder="$t('practice.searchPlaceholder')"
        />
      </div>

      <main class="mt-6 pb-10">
        <ContentSkeleton v-if="searching" variant="practice-home" />
        <p
          v-else-if="query.trim() && !filteredSteps.length"
          class="rounded-2xl border border-line bg-surface-elevated px-4 py-10 text-center text-sm text-ink-muted"
        >
          {{ $t('practice.emptySearch') }}
        </p>
        <MilestoneList
          v-else
          :milestones="index.milestones"
          :steps="filteredSteps"
          :is-done="isDone"
          :read-only="readOnly"
          :milestone-progress="milestoneStats"
          @open="openStep"
          @toggle="toggleDone"
        />
      </main>
    </div>
  </div>
</template>
