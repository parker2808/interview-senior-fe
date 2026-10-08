<script setup lang="ts">
import AppTopBar from '@/modules/core/components/AppTopBar/AppTopBar.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'
import DayList from '@/modules/study-plan/components/DayList/DayList.vue'
import ProgressTools from '@/modules/study-plan/components/ProgressTools/ProgressTools.vue'
import EditGateModal from '@/modules/study-plan/components/EditGateModal/EditGateModal.vue'
import { PLAN_GAPS } from '@/modules/study-plan/constants/plan-content.constant'
import {
  DAYS,
  PLAN_RESOURCES,
} from '@/modules/study-plan/constants/days.constant'
import { useProgress } from '@/modules/study-plan/composables/use-progress.composable'

const router = useRouter()
const { locale } = useI18n()

const lang = computed<'en' | 'vi'>(() =>
  locale.value === 'en' ? 'en' : 'vi',
)

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

const labels = computed(() =>
  lang.value === 'en'
    ? {
        unlock: 'Unlock',
        quickDocs: 'Quick resources',
        overview: 'What the rebuilt plan emphasizes',
        overviewSub: 'Keep each day around 2 hours: short reading, targeted Q&A, one small hands-on task, and one algorithm problem.',
        setupTitle: 'Day 0 / Setup once',
        setupBody: 'Create one practice repo for all 30 days, then keep reusing it instead of spinning up a new sandbox every day.',
        setupCta: 'Open shared lab setup',
        gaps: 'Content gaps to keep in mind',
        resources: {
          plan: '30-day overview',
          index: 'Daily index',
          lab: 'Companion lab repo',
          react: 'React / Next track',
          algo: 'Algorithms track',
          context: 'Project context',
          feature: 'Feature template',
          dod: 'Definition of Done',
          selfcheck: 'Self-check questions',
        } as Record<string, string>,
      }
    : {
        unlock: 'Mở khóa',
        quickDocs: 'Tài liệu nhanh',
        overview: 'Trọng tâm của plan mới',
        overviewSub: 'Giữ mỗi ngày khoảng 2 giờ: đọc ngắn, luyện Q&A có mục tiêu, một task hands-on nhỏ và một bài thuật toán.',
        setupTitle: 'Day 0 / Setup một lần',
        setupBody: 'Tạo một practice repo dùng chung cho cả 30 ngày, rồi tái sử dụng nó xuyên suốt thay vì mở sandbox mới mỗi ngày.',
        setupCta: 'Mở hướng dẫn setup repo',
        gaps: 'Khoảng trống nên biết',
        resources: {
          plan: 'Tổng quan 30 ngày',
          index: 'Mục lục theo ngày',
          lab: 'Companion lab repo',
          react: 'Lộ trình React / Next',
          algo: 'Lộ trình thuật toán',
          context: 'Bối cảnh dự án',
          feature: 'Feature template',
          dod: 'Definition of Done',
          selfcheck: 'Self-check questions',
        } as Record<string, string>,
      },
)

function openDay(day: number) {
  router.push(`/plan/day/${day}`)
}

function openResource(path: string) {
  router.push(`/plan/doc/${encodeURIComponent(path)}`)
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
        <NuxtLink
          to="/docs?from=plan"
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
        </NuxtLink>
        <LocaleToggle />
        <ThemeToggle />
      </template>
    </AppTopBar>

    <div class="animate-fade-up px-4 pt-5 sm:px-6 sm:pt-8">
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
            {{ labels.unlock }}
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
        {{ labels.overview }}
      </p>
      <p class="mt-2 max-w-3xl text-sm leading-6 text-ink-muted">
        {{ labels.overviewSub }}
      </p>
      <div class="mt-4 rounded-xl border border-line bg-surface p-3 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-accent-ink">
            {{ labels.setupTitle }}
          </p>
          <p class="mt-1 text-sm leading-6 text-ink-muted">
            {{ labels.setupBody }}
          </p>
        </div>
        <button
          type="button"
          class="mt-3 min-h-10 rounded-lg border border-line bg-surface-elevated px-3 text-sm font-medium text-ink transition hover:border-accent hover:text-accent-ink sm:mt-0"
          @click="openResource('lab-repo.md')"
        >
          {{ labels.setupCta }}
        </button>
      </div>
      <p class="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-faint">
        {{ labels.gaps }}
      </p>
      <ul class="mt-4 space-y-2 text-sm text-ink">
        <li
          v-for="(item, index) in PLAN_GAPS"
          :key="index"
          class="flex items-start gap-2"
        >
          <span class="mt-1 text-accent-ink">•</span>
          <span>{{ item[lang] }}</span>
        </li>
      </ul>
    </section>

    <nav class="mt-4 rounded-xl border border-line bg-surface-elevated/70" :aria-label="labels.quickDocs">
      <button
        type="button"
        class="flex min-h-11 w-full items-center justify-between px-3 text-sm font-semibold sm:hidden"
        @click="navOpen = !navOpen"
      >
        {{ labels.quickDocs }}
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
          class="min-h-10 rounded-lg border border-line bg-surface-elevated px-3 text-sm font-medium text-ink transition hover:border-accent hover:text-accent-ink"
          @click="openResource(r.path)"
        >
          {{ labels.resources[r.id] || r.label }}
        </button>
      </div>
    </nav>

    <main class="mt-6 pb-10">
      <DayList
        :days="filteredDays"
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
