<script setup lang="ts">
import AppTopBar from '@/modules/core/components/AppTopBar/AppTopBar.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'
import DayList from '@/modules/study-plan/components/DayList/DayList.vue'
import ProgressTools from '@/modules/study-plan/components/ProgressTools/ProgressTools.vue'
import EditGateModal from '@/modules/study-plan/components/EditGateModal/EditGateModal.vue'
import { useProgress } from '@/modules/study-plan/composables/use-progress.composable'
import {
  planResourceHref,
  usePlanIndex,
} from '@/modules/study-plan/composables/use-plan-index.composable'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'
import ContentSkeleton from '@/modules/content/components/ContentSkeleton/ContentSkeleton.vue'
import ContentStatus from '@/modules/content/components/ContentStatus/ContentStatus.vue'

const router = useRouter()
const { locale } = useI18n()

const lang = computed<'en' | 'vi'>(() =>
  locale.value === 'en' ? 'en' : 'vi',
)

const {
  data: plan,
  pending,
  error,
  refresh,
} = await usePlanIndex()

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
  weekStats,
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
} = useProgress()

const weekFilter = ref(0)
const navOpen = ref(false)

const filteredDays = computed(() => {
  const days = plan.value?.days ?? []
  return weekFilter.value === 0
    ? days
    : days.filter((d) => d.week === weekFilter.value)
})

function openDay(day: number) {
  router.push(`/plan/day/${day}`)
}

function openResource(id: string) {
  router.push(planResourceHref(id))
  navOpen.value = false
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
      :title="$t('plan.title')"
      :home-label="$t('plan.backHub')"
      :lock-visible="navOpen"
    >
      <template #actions>
        <a
          href="/docs"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-elevated text-ink transition hover:border-accent hover:text-accent-ink"
          :aria-label="$t('plan.openDocs')"
          :title="$t('plan.openDocs')"
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
      v-if="pending && !plan"
      variant="plan-home"
      class="px-4 pt-5 sm:px-6 sm:pt-8"
    />
    <ContentStatus
      v-else-if="error"
      class="mx-4 mt-5 sm:mx-6"
      kind="error"
      :message="$t('plan.loadError')"
      :retrying="retrying"
      @retry="retry"
    />
    <ContentStatus
      v-else-if="!plan?.days.length"
      class="mx-4 mt-5 sm:mx-6"
      kind="empty"
      :message="$t('plan.empty')"
    />
    <div v-else class="animate-fade-up px-4 pt-5 sm:px-6 sm:pt-8">
    <header class="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-start sm:justify-between">
      <div class="min-w-0">
        <p class="text-xs font-semibold uppercase tracking-wider text-accent-ink">
          {{ $t('plan.eyebrow') }}
        </p>
        <div class="mt-2 flex flex-wrap items-center gap-2">
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
            <span>{{ completedCount }}/30</span>
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

    <section class="mt-4 rounded-2xl border border-line bg-surface-elevated/70 p-4 sm:p-5">
      <p class="text-xs font-semibold uppercase tracking-wider text-accent-ink">
        {{ $t('plan.overview') }}
      </p>
      <p class="mt-2 max-w-3xl text-sm leading-6 text-ink-muted">
        {{ $t('plan.overviewSub') }}
      </p>
      <div class="mt-4 rounded-xl border border-line bg-surface p-3 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-accent-ink">
            {{ $t('plan.setupTitle') }}
          </p>
          <p class="mt-1 text-sm leading-6 text-ink-muted">
            {{ $t('plan.setupBody') }}
          </p>
        </div>
        <button
          type="button"
          class="mt-3 min-h-10 rounded-lg border border-line bg-surface-elevated px-3 text-sm font-medium text-ink transition hover:border-accent hover:text-accent-ink sm:mt-0"
          @click="openResource('lab')"
        >
          {{ $t('plan.setupCta') }}
        </button>
      </div>
      <p class="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-faint">
        {{ $t('plan.gaps') }}
      </p>
      <ul class="mt-4 space-y-2 text-sm text-ink">
        <li
          v-for="(item, index) in plan.gaps"
          :key="index"
          class="flex items-start gap-2"
        >
          <span class="mt-1 text-accent-ink">•</span>
          <span>{{ pickLocale(item, lang) }}</span>
        </li>
      </ul>
    </section>

    <nav class="mt-4 rounded-xl border border-line bg-surface-elevated/70" :aria-label="$t('plan.quickDocs')">
      <button
        type="button"
        class="flex min-h-11 w-full items-center justify-between px-3 text-sm font-semibold sm:hidden"
        @click="navOpen = !navOpen"
      >
        {{ $t('plan.quickDocs') }}
        <span>{{ navOpen ? '▴' : '▾' }}</span>
      </button>
      <div
        class="flex flex-wrap gap-2 p-3"
        :class="navOpen ? 'flex' : 'hidden sm:flex'"
      >
        <button
          v-for="r in plan.resources"
          :key="r.id"
          type="button"
          class="min-h-10 rounded-lg border border-line bg-surface-elevated px-3 text-sm font-medium text-ink transition hover:border-accent hover:text-accent-ink"
          @click="openResource(r.id)"
        >
          {{ $t(`plan.resources.${r.id}`) }}
        </button>
      </div>
    </nav>

    <main class="mt-6 pb-10">
      <DayList
        :days="filteredDays"
        :weeks="plan.weeks"
        :week-filter="weekFilter"
        :is-done="isDone"
        :read-only="readOnly"
        :week-progress="weekStats"
        @update:week-filter="weekFilter = $event"
        @open="openDay"
        @toggle="toggleDone"
      />
    </main>
    </div>
  </div>
</template>
