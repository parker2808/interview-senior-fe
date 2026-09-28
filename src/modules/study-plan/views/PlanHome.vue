<script setup lang="ts">
import BackLink from '@/modules/core/components/BackLink/BackLink.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import DayList from '@/modules/study-plan/components/DayList/DayList.vue'
import ProgressTools from '@/modules/study-plan/components/ProgressTools/ProgressTools.vue'
import EditGateModal from '@/modules/study-plan/components/EditGateModal/EditGateModal.vue'
import {
  DAYS,
  PLAN_RESOURCES,
  WEEK_LABELS,
} from '@/modules/study-plan/constants/days.constant'
import { useProgress } from '@/modules/study-plan/composables/use-progress.composable'

const router = useRouter()

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

const filteredDays = computed(() =>
  weekFilter.value === 0
    ? DAYS
    : DAYS.filter((d) => d.week === weekFilter.value),
)

const weekProgress = computed(() => weekStats(weekFilter.value))

function openDay(day: number) {
  router.push(`/plan/day/${day}`)
}

function openResource(path: string) {
  router.push(`/plan/doc/${encodeURIComponent(path)}`)
  navOpen.value = false
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

    <header class="animate-fade-up flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-start sm:justify-between">
      <div class="min-w-0">
        <div class="mb-3 flex flex-wrap gap-2">
          <BackLink :label="$t('plan.backHub')" />
          <NuxtLink
            to="/docs"
            class="inline-flex min-h-10 items-center rounded-lg border border-line bg-surface-elevated px-3 text-sm font-semibold"
          >
            {{ $t('plan.openDocs') }}
          </NuxtLink>
        </div>
        <p class="text-xs font-semibold uppercase tracking-wider text-accent-ink">
          {{ $t('plan.eyebrow') }}
        </p>
        <h1 class="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {{ $t('plan.title') }}
        </h1>
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
            Mở khóa
          </button>
        </div>
      </div>

      <div class="flex flex-col items-stretch gap-3 sm:items-end">
        <LocaleToggle />
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

    <nav class="mt-4 rounded-xl border border-line bg-surface-elevated/70" aria-label="Tài liệu nhanh">
      <button
        type="button"
        class="flex min-h-11 w-full items-center justify-between px-3 text-sm font-semibold sm:hidden"
        @click="navOpen = !navOpen"
      >
        Tài liệu nhanh
        <span>{{ navOpen ? '▴' : '▾' }}</span>
      </button>
      <div
        class="flex flex-wrap gap-2 p-3"
        :class="navOpen ? 'flex' : 'hidden sm:flex'"
      >
        <button
          v-for="r in PLAN_RESOURCES"
          :key="r.id"
          type="button"
          class="min-h-10 rounded-lg border border-line bg-white px-3 text-sm font-medium hover:border-accent"
          @click="openResource(r.path)"
        >
          {{ r.label }}
        </button>
      </div>
    </nav>

    <main class="mt-6 pb-10">
      <DayList
        :days="filteredDays"
        :week-filter="weekFilter"
        :week-labels="WEEK_LABELS"
        :week-progress="weekProgress"
        :is-done="isDone"
        :read-only="readOnly"
        @update:week-filter="weekFilter = $event"
        @open="openDay"
        @toggle="toggleDone"
      />
    </main>
  </div>
</template>
