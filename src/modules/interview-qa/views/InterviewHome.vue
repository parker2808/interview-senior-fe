<script setup lang="ts">
import AppTopBar from '@/modules/core/components/AppTopBar/AppTopBar.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'
import InterviewPinGate from '@/modules/interview-qa/components/InterviewPinGate/InterviewPinGate.vue'
import QuestionCard from '@/modules/interview-qa/components/QuestionCard/QuestionCard.vue'
import { useInterviewUnlock } from '@/modules/interview-qa/composables/use-interview-unlock.composable'
import type {
  InterviewCategoryId,
  InterviewLang,
} from '@/modules/interview-qa/types/interview.type'

const { locale, t } = useI18n()
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
  boot,
  submitPasscode,
  lock,
} = useInterviewUnlock()

const categoryFilter = ref<'all' | InterviewCategoryId>('all')
const query = ref('')
const openIds = ref<Set<string>>(new Set())

onMounted(() => {
  boot()
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return questions.value.filter((item) => {
    if (categoryFilter.value !== 'all' && item.category !== categoryFilter.value) {
      return false
    }
    if (!q) return true
    const blob = [
      item.question.vi,
      item.question.en,
      item.tags.join(' '),
      item.answer.vi,
      item.answer.en,
    ]
      .join(' ')
      .toLowerCase()
    return blob.includes(q)
  })
})

function toggle(id: string) {
  const next = new Set(openIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  openIds.value = next
}

function expandAll() {
  openIds.value = new Set(filtered.value.map((q) => q.id))
}

function collapseAll() {
  openIds.value = new Set()
}

const gateOpen = computed(() => !unlocked.value)
</script>

<template>
  <div class="mx-auto min-h-screen max-w-hub pb-10">
    <InterviewPinGate
      :open="gateOpen"
      :unlocking="unlocking || loadingQuestions"
      :error="unlockError || loadError"
      @submit="submitPasscode"
    />

    <AppTopBar
      :title="$t('interview.title')"
      :home-label="t('interview.backHub')"
    >
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

    <div v-if="unlocked" class="px-4 pt-6 sm:px-6 lg:px-8">
      <header class="max-w-3xl">
        <p class="text-sm font-semibold uppercase tracking-[0.14em] text-accent-ink">
          {{ $t('interview.eyebrow') }}
        </p>
        <h1 class="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {{ $t('interview.headline') }}
        </h1>
        <p class="mt-3 text-sm text-ink-muted sm:text-base">
          {{ $t('interview.sub') }}
        </p>
      </header>

      <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          v-model="query"
          type="search"
          class="min-h-11 w-full flex-1 rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-accent"
          :placeholder="$t('interview.searchPlaceholder')"
        />
        <div class="flex gap-2">
          <button
            type="button"
            class="min-h-11 rounded-lg border border-line bg-white px-3 text-sm font-semibold"
            @click="expandAll"
          >
            {{ $t('interview.expandAll') }}
          </button>
          <button
            type="button"
            class="min-h-11 rounded-lg border border-line bg-white px-3 text-sm font-semibold"
            @click="collapseAll"
          >
            {{ $t('interview.collapseAll') }}
          </button>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap gap-2" role="tablist">
        <button
          type="button"
          class="min-h-10 rounded-lg px-3 text-sm font-semibold"
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
          class="min-h-10 rounded-lg px-3 text-sm font-semibold"
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

      <p class="mt-3 text-xs text-ink-faint">
        {{ filtered.length }} / {{ questions.length }}
        {{ $t('interview.questionCount') }}
      </p>

      <div
        class="mt-4 min-w-0 overflow-hidden rounded-2xl border border-line bg-surface-elevated px-3 sm:px-5"
      >
        <QuestionCard
          v-for="item in filtered"
          :key="item.id"
          :item="item"
          :lang="lang"
          :open="openIds.has(item.id)"
          @toggle="toggle(item.id)"
        />
        <p
          v-if="!filtered.length"
          class="px-1 py-8 text-center text-sm text-ink-muted"
        >
          {{ $t('interview.empty') }}
        </p>
      </div>
    </div>

    <div
      v-else-if="loadingQuestions"
      class="px-4 pt-16 text-center text-sm text-ink-muted"
    >
      {{ $t('interview.loading') }}
    </div>
  </div>
</template>
