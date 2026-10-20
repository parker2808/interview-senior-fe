<script setup lang="ts">
import type {
  InterviewCategoryMeta,
  InterviewLang,
  InterviewQuestion,
} from '@/modules/interview-qa/types/interview.type'
import { groupInterviewQuestions } from '@/modules/interview-qa/utils/qa-search.util'

const props = defineProps<{
  questions: InterviewQuestion[]
  categories: InterviewCategoryMeta[]
  lang: InterviewLang
  activeId: string
}>()

defineEmits<{
  select: [id: string]
}>()

const listRef = ref<HTMLElement | null>(null)

const grouped = computed(() =>
  groupInterviewQuestions(props.questions, props.categories),
)

watch(
  () => props.activeId,
  async (id) => {
    if (!id || !import.meta.client) return
    await nextTick()
    const safe =
      typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
        ? CSS.escape(id)
        : id.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    const el = listRef.value?.querySelector<HTMLElement>(`[data-qid="${safe}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  },
  { immediate: true },
)
</script>

<template>
  <nav ref="listRef" class="flex min-w-0 flex-col" :aria-label="$t('interview.title')">
    <div v-for="group in grouped" :key="group.category.id">
      <p
        class="sticky top-0 z-[1] bg-surface-elevated/95 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink-faint"
      >
        {{ group.category.title[lang] }}
      </p>
      <button
        v-for="item in group.questions"
        :key="item.id"
        type="button"
        :data-qid="item.id"
        class="flex min-h-12 min-w-0 w-full flex-col items-start gap-1 border-b border-line px-3 py-3 text-left text-sm transition last:border-b-0"
        :class="
          item.id === activeId
            ? 'bg-accent-soft font-semibold text-accent-ink'
            : 'text-ink hover:bg-white'
        "
        @click="$emit('select', item.id)"
      >
        <span class="min-w-0 max-w-full line-clamp-2 overflow-hidden">{{ item.question[lang] }}</span>
        <span class="flex flex-wrap gap-1">
          <span
            v-for="tag in item.tags.slice(0, 3)"
            :key="tag"
            class="rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-medium text-accent-ink"
          >
            {{ tag }}
          </span>
        </span>
      </button>
    </div>
    <p
      v-if="!questions.length"
      class="px-3 py-8 text-center text-sm text-ink-muted"
    >
      {{ $t('interview.empty') }}
    </p>
  </nav>
</template>
