<script setup lang="ts">
import AppTopBar from '@/modules/core/components/AppTopBar/AppTopBar.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'
import InterviewPinGate from '@/modules/interview-qa/components/InterviewPinGate/InterviewPinGate.vue'
import InterviewQuestionNav from '@/modules/interview-qa/components/InterviewQuestionNav/InterviewQuestionNav.vue'
import InterviewQuestionDetail from '@/modules/interview-qa/components/InterviewQuestionDetail/InterviewQuestionDetail.vue'
import ContentSkeleton from '@/modules/content/components/ContentSkeleton/ContentSkeleton.vue'
import ContentStatus from '@/modules/content/components/ContentStatus/ContentStatus.vue'
import { useInterviewUnlock } from '@/modules/interview-qa/composables/use-interview-unlock.composable'
import type {
  InterviewCategoryId,
  InterviewLang,
} from '@/modules/interview-qa/types/interview.type'
import { filterInterviewQuestions } from '@/modules/interview-qa/utils/qa-search.util'
import {
  questionExists,
  requestedQuestionId,
  withQuestionQuery,
} from '@/modules/interview-qa/utils/qa-route.util'
import {
  qaIsContentLoading,
  qaIsGateOpen,
  qaShouldShowQuestions,
} from '@/modules/interview-qa/utils/qa-session-view.util'

const { locale, t } = useI18n()
const route = useRoute()
const router = useRouter()
const lang = computed<InterviewLang>(() =>
  locale.value === 'en' ? 'en' : 'vi',
)

const {
  unlocked,
  unlocking,
  loadingQuestions,
  unlockError,
  loadError,
  categories,
  questions,
  sessionReady,
  sessionTimedOut,
  questionsTimedOut,
  submitPasscode,
  lock,
  reload,
} = await useInterviewUnlock()

const categoryFilter = ref<'all' | InterviewCategoryId>('all')
const query = ref('')
const navOpen = ref(false)
const mobileShowList = ref(true)
const mainRef = ref<HTMLElement | null>(null)
const topBarHeight = ref(56)

const filtered = computed(() =>
  filterInterviewQuestions(questions.value, {
    query: query.value,
    category: categoryFilter.value,
    lang: lang.value,
  }),
)

const requestedId = computed(() =>
  requestedQuestionId({ query: route.query.q, hash: route.hash }),
)

const selected = computed(() => {
  const id = requestedId.value
  if (id && questionExists(filtered.value, id)) {
    return filtered.value.find((item) => item.id === id) ?? null
  }
  if (id && questionExists(questions.value, id)) {
    return questions.value.find((item) => item.id === id) ?? null
  }
  return filtered.value[0] ?? questions.value[0] ?? null
})

const selectedId = computed(() => selected.value?.id || '')

const view = computed(() => ({
  sessionPending: !sessionReady.value,
  sessionTimedOut: Boolean(sessionTimedOut.value),
  unlocked: unlocked.value,
  questionsPending: loadingQuestions.value,
  questionsTimedOut: Boolean(questionsTimedOut.value),
  questionCount: questions.value.length,
  loadError: loadError.value,
}))

const contentLoading = computed(() => qaIsContentLoading(view.value))
const gateOpen = computed(() => qaIsGateOpen(view.value))
const showQuestions = computed(() => qaShouldShowQuestions(view.value))

const showMobileDetail = computed(
  () => Boolean(selected.value) && !mobileShowList.value,
)

function setQuestion(id: string, replace = true) {
  mobileShowList.value = false
  navOpen.value = false
  const nextQuery = withQuestionQuery(
    { ...route.query } as Record<string, string | string[] | null | undefined>,
    id,
  )
  const method = replace ? router.replace : router.push
  void method({ path: '/interview', query: nextQuery, hash: '' })
}

function backToList() {
  mobileShowList.value = true
  navOpen.value = false
}

onMounted(() => {
  document.documentElement.classList.add('docs-lock-scroll')
  document.body.classList.add('docs-lock-scroll')
})
onUnmounted(() => {
  document.documentElement.classList.remove('docs-lock-scroll')
  document.body.classList.remove('docs-lock-scroll')
})

watch(
  [requestedId, unlocked, questions],
  ([id, isUnlocked, loaded]) => {
    if (!isUnlocked || !loaded.length) return
    if (id && questionExists(loaded, id)) {
      mobileShowList.value = false
      return
    }
    if (id && !questionExists(filtered.value, id) && questionExists(loaded, id)) {
      categoryFilter.value = 'all'
      query.value = ''
      mobileShowList.value = false
      return
    }
    if (!id) mobileShowList.value = true
  },
  { immediate: true },
)

watch(selectedId, async (id) => {
  if (!import.meta.client || !id) return
  await nextTick()
  const pane = mainRef.value
  if (pane) pane.scrollTop = 0
})

async function onRetry() {
  const ok = await reload()
  if (ok && requestedId.value) {
    await nextTick()
    setQuestion(requestedId.value)
  }
}

async function onUnlock(passcode: string) {
  const ok = await submitPasscode(passcode)
  if (ok && requestedId.value) {
    await nextTick()
    setQuestion(requestedId.value)
  }
}
</script>

<template>
  <div
    class="docs-shell flex h-dvh max-h-dvh flex-col overflow-hidden"
    :style="{ '--docs-header-h': `${topBarHeight}px` }"
  >
    <InterviewPinGate
      :open="gateOpen"
      :unlocking="unlocking"
      :error="unlockError || loadError"
      @submit="onUnlock"
    />

    <AppTopBar
      :title="$t('interview.title')"
      :home-label="t('interview.backHub')"
      inner-class="px-2 sm:px-4 lg:px-5"
      :scroll-target="mainRef"
      :lock-visible="true"
      @heightchange="topBarHeight = $event"
    >
      <template #leading>
        <button
          v-if="showQuestions"
          type="button"
          class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-ink lg:hidden"
          :aria-label="$t('interview.openNav')"
          :title="$t('interview.openNav')"
          @click="navOpen = true"
        >
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </template>
      <template #actions>
        <button
          v-if="unlocked"
          type="button"
          class="hidden min-h-10 rounded-lg border border-line bg-white px-3 text-sm font-semibold sm:inline-flex sm:items-center"
          @click="lock"
        >
          {{ $t('interview.lock') }}
        </button>
        <LocaleToggle />
        <ThemeToggle />
      </template>
    </AppTopBar>

    <div v-if="showQuestions" class="docs-split flex min-h-0 flex-1 flex-col lg:flex-row">
      <aside
        class="hidden min-h-0 w-80 shrink-0 flex-col overflow-hidden border-r border-line bg-surface-elevated/70 lg:flex xl:w-96"
      >
        <div class="shrink-0 space-y-3 border-b border-line p-3">
          <input
            v-model="query"
            type="search"
            class="min-h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-accent"
            :placeholder="$t('interview.searchPlaceholder')"
          />
          <div class="flex flex-wrap gap-2" role="tablist">
            <button
              type="button"
              class="min-h-9 rounded-lg px-2.5 text-xs font-semibold"
              :class="
                categoryFilter === 'all'
                  ? 'bg-accent text-white'
                  : 'border border-line bg-white'
              "
              @click="categoryFilter = 'all'"
            >
              {{ $t('interview.allCategories') }}
            </button>
            <button
              v-for="cat in categories"
              :key="cat.id"
              type="button"
              class="min-h-9 rounded-lg px-2.5 text-xs font-semibold"
              :class="
                categoryFilter === cat.id
                  ? 'bg-accent text-white'
                  : 'border border-line bg-white'
              "
              @click="categoryFilter = cat.id"
            >
              {{ cat.title[lang] }}
            </button>
          </div>
          <p class="text-xs text-ink-faint">
            {{ filtered.length }} / {{ questions.length }}
            {{ $t('interview.questionCount') }}
          </p>
        </div>
        <div class="docs-nav-pane min-h-0 flex-1">
          <InterviewQuestionNav
            :questions="filtered"
            :categories="categories"
            :lang="lang"
            :active-id="selectedId"
            @select="setQuestion"
          />
        </div>
      </aside>

      <Teleport to="body">
        <div v-if="navOpen" class="fixed inset-0 z-40 lg:hidden">
          <div class="absolute inset-0 bg-ink/40" @click="navOpen = false" />
          <aside
            class="absolute inset-y-0 left-0 flex w-[min(100%,22rem)] min-w-0 flex-col overflow-hidden bg-surface-elevated shadow-xl"
          >
            <div class="flex items-center justify-between border-b border-line px-3 py-2">
              <p class="text-sm font-semibold">{{ $t('interview.openNav') }}</p>
              <button
                type="button"
                class="inline-flex h-10 w-10 items-center justify-center rounded-lg"
                :aria-label="$t('docs.closeNav')"
                @click="navOpen = false"
              >
                ×
              </button>
            </div>
            <div class="shrink-0 space-y-3 border-b border-line p-3">
              <input
                v-model="query"
                type="search"
                class="min-h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-accent"
                :placeholder="$t('interview.searchPlaceholder')"
              />
            </div>
            <div class="docs-nav-pane min-h-0 flex-1">
              <InterviewQuestionNav
                :questions="filtered"
                :categories="categories"
                :lang="lang"
                :active-id="selectedId"
                @select="setQuestion"
              />
            </div>
          </aside>
        </div>
      </Teleport>

      <main ref="mainRef" class="docs-main docs-pane min-h-0 min-w-0 flex-1">
        <div class="lg:hidden">
          <div v-if="!showMobileDetail" class="flex min-h-0 flex-col">
            <div class="space-y-3 border-b border-line p-4">
              <input
                v-model="query"
                type="search"
                class="min-h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-accent"
                :placeholder="$t('interview.searchPlaceholder')"
              />
              <div class="flex flex-wrap gap-2">
                <button
                  type="button"
                  class="min-h-9 rounded-lg px-2.5 text-xs font-semibold"
                  :class="
                    categoryFilter === 'all'
                      ? 'bg-accent text-white'
                      : 'border border-line bg-white'
                  "
                  @click="categoryFilter = 'all'"
                >
                  {{ $t('interview.allCategories') }}
                </button>
                <button
                  v-for="cat in categories"
                  :key="cat.id"
                  type="button"
                  class="min-h-9 rounded-lg px-2.5 text-xs font-semibold"
                  :class="
                    categoryFilter === cat.id
                      ? 'bg-accent text-white'
                      : 'border border-line bg-white'
                  "
                  @click="categoryFilter = cat.id"
                >
                  {{ cat.title[lang] }}
                </button>
              </div>
            </div>
            <InterviewQuestionNav
              :questions="filtered"
              :categories="categories"
              :lang="lang"
              :active-id="selectedId"
              @select="setQuestion"
            />
          </div>
          <div v-else class="px-4 py-5 sm:px-6">
            <button
              type="button"
              class="mb-4 inline-flex min-h-10 items-center gap-1 rounded-lg border border-line bg-white px-3 text-sm font-semibold"
              @click="backToList"
            >
              ← {{ $t('interview.backList') }}
            </button>
            <InterviewQuestionDetail
              v-if="selected"
              :item="selected"
              :lang="lang"
            />
          </div>
        </div>

        <div class="hidden px-4 py-6 sm:px-6 lg:block lg:px-8">
          <InterviewQuestionDetail
            v-if="selected"
            :item="selected"
            :lang="lang"
          />
          <p v-else class="py-16 text-center text-sm text-ink-muted">
            {{ $t('interview.selectPrompt') }}
          </p>
        </div>
      </main>
    </div>

    <div v-else-if="contentLoading" class="px-4 pt-6 sm:px-6 lg:px-8">
      <ContentSkeleton variant="qa" />
    </div>

    <div
      v-else-if="unlocked && loadError"
      class="px-4 pt-6 sm:px-6 lg:px-8"
    >
      <ContentStatus
        kind="error"
        :message="loadError"
        :retrying="loadingQuestions"
        @retry="onRetry"
      />
    </div>
  </div>
</template>
