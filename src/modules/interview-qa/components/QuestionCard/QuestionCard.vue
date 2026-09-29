<script setup lang="ts">
import { marked } from 'marked'
import type {
  InterviewLang,
  InterviewQuestion,
} from '@/modules/interview-qa/types/interview.type'

const props = defineProps<{
  item: InterviewQuestion
  lang: InterviewLang
  open: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

function md(text: string) {
  return marked.parse(text || '', { async: false }) as string
}

const answerHtml = computed(() => md(props.item.answer[props.lang]))
const exampleHtml = computed(() =>
  props.item.example ? md(props.item.example[props.lang]) : '',
)
</script>

<template>
  <article class="border-b border-line last:border-b-0">
    <button
      type="button"
      class="flex w-full items-start gap-3 px-1 py-4 text-left"
      :aria-expanded="open"
      @click="emit('toggle')"
    >
      <span
        class="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-line text-xs font-bold"
        aria-hidden="true"
      >
        {{ open ? '−' : '+' }}
      </span>
      <span class="min-w-0 flex-1">
        <span class="block text-base font-semibold text-ink sm:text-lg">
          {{ item.question[lang] }}
        </span>
        <span class="mt-1 flex flex-wrap gap-1.5">
          <span
            v-for="tag in item.tags"
            :key="tag"
            class="rounded bg-accent-soft px-1.5 py-0.5 text-[11px] font-medium text-accent-ink"
          >
            {{ tag }}
          </span>
        </span>
      </span>
    </button>

    <div v-if="open" class="animate-fade-up space-y-4 pb-5 pl-9 pr-1">
      <section>
        <h3 class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          {{ $t('interview.answer') }}
        </h3>
        <div class="prose-doc mt-2 text-sm sm:text-base" v-html="answerHtml" />
      </section>

      <section v-if="item.example">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          {{ $t('interview.example') }}
        </h3>
        <div class="prose-doc mt-2 text-sm sm:text-base" v-html="exampleHtml" />
      </section>

      <section v-if="item.followUps?.length">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          {{ $t('interview.followUps') }}
        </h3>
        <ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
          <li v-for="(f, i) in item.followUps" :key="i">{{ f[lang] }}</li>
        </ul>
      </section>
    </div>
  </article>
</template>
