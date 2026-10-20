<script setup lang="ts">
import type {
  InterviewLang,
  InterviewQuestion,
} from '@/modules/interview-qa/types/interview.type'
import { renderMarkdown } from '@/modules/content/utils/inline-md.util'

const props = defineProps<{
  item: InterviewQuestion
  lang: InterviewLang
}>()

function md(text: string) {
  return renderMarkdown(text || '')
}

const answerHtml = computed(() => md(props.item.answer[props.lang]))
const exampleHtml = computed(() =>
  props.item.example ? md(props.item.example[props.lang]) : '',
)
</script>

<template>
  <article :id="item.id" class="min-w-0">
    <header>
      <h1 class="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        {{ item.question[lang] }}
      </h1>
      <div class="mt-3 flex flex-wrap gap-1.5">
        <span
          v-for="tag in item.tags"
          :key="tag"
          class="rounded bg-accent-soft px-1.5 py-0.5 text-[11px] font-medium text-accent-ink"
        >
          {{ tag }}
        </span>
      </div>
    </header>

    <div class="mt-6 space-y-6">
      <section>
        <h2 class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          {{ $t('interview.answer') }}
        </h2>
        <div class="prose-doc mt-2 text-sm sm:text-base" v-html="answerHtml" />
      </section>

      <section v-if="item.example">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          {{ $t('interview.example') }}
        </h2>
        <div class="prose-doc mt-2 text-sm sm:text-base" v-html="exampleHtml" />
      </section>

      <section v-if="item.followUps?.length">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          {{ $t('interview.followUps') }}
        </h2>
        <ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
          <li v-for="(f, i) in item.followUps" :key="i">{{ f[lang] }}</li>
        </ul>
      </section>
    </div>
  </article>
</template>
