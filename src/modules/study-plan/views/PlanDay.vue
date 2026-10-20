<script setup lang="ts">
import AppTopBar from '@/modules/core/components/AppTopBar/AppTopBar.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'
import AppDetailShell from '@/modules/core/components/AppDetailShell/AppDetailShell.vue'
import DayDetail from '@/modules/study-plan/components/DayDetail/DayDetail.vue'
import PlanDayNav from '@/modules/study-plan/components/PlanDayNav/PlanDayNav.vue'
import EditGateModal from '@/modules/study-plan/components/EditGateModal/EditGateModal.vue'
import { useProgress } from '@/modules/study-plan/composables/use-progress.composable'
import {
  usePlanDay,
  usePlanIndex,
  planResourceHref,
} from '@/modules/study-plan/composables/use-plan-index.composable'
import {
  docsHref,
  openInNewTab,
} from '@/modules/study-plan/utils/open-app-link.util'
import ContentSkeleton from '@/modules/content/components/ContentSkeleton/ContentSkeleton.vue'
import ContentStatus from '@/modules/content/components/ContentStatus/ContentStatus.vue'

const props = defineProps<{
  dayNumber: number
}>()

const router = useRouter()
const { t } = useI18n()
const dayNumber = computed(() => props.dayNumber)
const navOpen = ref(false)
const {
  data: day,
  pending,
  error,
  refresh,
} = await usePlanDay(dayNumber)
const { data: plan } = await usePlanIndex()

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

function goDay(n: number) {
  navOpen.value = false
  router.push(`/plan/day/${n}`)
}
</script>

<template>
  <AppDetailShell v-model:nav-open="navOpen">
    <template #topbar="{ onHeightChange, scrollTarget }">
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
        inner-class="px-2 sm:px-4 lg:px-5"
        :scroll-target="scrollTarget"
        :lock-visible="navOpen"
        @heightchange="onHeightChange"
      >
        <template #leading>
          <button
            type="button"
            class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-ink lg:hidden"
            :aria-label="$t('docs.openNav')"
            @click="navOpen = true"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </template>
        <template #actions>
          <LocaleToggle />
          <ThemeToggle />
        </template>
      </AppTopBar>
    </template>

    <template #nav>
      <PlanDayNav
        v-if="plan"
        :days="plan.days"
        :weeks="plan.weeks"
        :active-day="dayNumber"
        :is-done="isDone"
        @select="goDay"
      />
    </template>

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
    <ContentSkeleton v-else-if="pending" variant="plan-day" />
    <ContentStatus
      v-else-if="error"
      kind="error"
      :message="t('plan.loadError')"
      :retrying="retrying"
      @retry="retry"
    />
    <ContentStatus
      v-else
      kind="empty"
      :message="t('plan.dayNotFound')"
    />
  </AppDetailShell>
</template>
