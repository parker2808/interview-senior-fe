<script setup lang="ts">
import type { PracticeStep, TocItem } from '@/modules/content/types'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'
import {
  docsHref,
  interviewHref,
} from '@/modules/study-plan/utils/open-app-link.util'
import { practiceStepHref } from '@/modules/practice/composables/use-practice-index.composable'
import SpecRefLinks from '@/modules/practice/components/SpecRefLinks/SpecRefLinks.vue'

withDefaults(
  defineProps<{
    step: PracticeStep
    done: boolean
    readOnly: boolean
    prevId: string | null
    nextId: string | null
    headings?: TocItem[]
  }>(),
  { headings: () => [] },
)

defineEmits<{
  toggle: []
  prev: []
  next: []
}>()

const { locale } = useI18n()
const lang = computed<'en' | 'vi'>(() =>
  locale.value === 'en' ? 'en' : 'vi',
)

const linkClass =
  'inline-flex min-h-10 items-center rounded-lg border border-line bg-surface px-3 text-sm font-medium text-ink transition hover:border-accent hover:text-accent-ink'
</script>

<template>
  <article class="animate-fade-up rounded-2xl border border-line bg-surface-elevated p-4 sm:p-6">
    <header class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-accent-ink">
          {{ step.id.toUpperCase() }} · {{ step.milestone.toUpperCase() }}
        </p>
        <h2 class="mt-1 text-xl font-bold sm:text-2xl">
          {{ pickLocale(step.title, lang) }}
        </h2>
        <p class="mt-2 text-sm text-ink-muted">
          {{ step.estimateMin }} {{ $t('practice.minutes') }}
        </p>
      </div>
      <label
        class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-surface-elevated px-3 text-sm font-medium text-ink"
        :class="readOnly ? 'opacity-70' : ''"
      >
        <input
          type="checkbox"
          class="themed-checkbox"
          :checked="done"
          :disabled="readOnly"
          @change="$emit('toggle')"
        />
        <span>
          {{
            readOnly
              ? done
                ? $t('practice.doneReadOnly')
                : $t('practice.pendingReadOnly')
              : done
                ? $t('practice.done')
                : $t('practice.markDone')
          }}
        </span>
      </label>
    </header>

    <section class="space-y-6">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-accent-ink">
          {{ $t('practice.why') }}
        </p>
        <p class="mt-2 text-sm leading-6 text-ink sm:text-base">
          {{ pickLocale(step.summary, lang) }}
        </p>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          {{ $t('practice.prereqs') }}
        </p>
        <div v-if="step.prereqs.length" class="mt-3 flex flex-wrap gap-2">
          <NuxtLink
            v-for="id in step.prereqs"
            :key="id"
            :to="practiceStepHref(id)"
            :class="linkClass"
          >
            {{ id.toUpperCase() }}
          </NuxtLink>
        </div>
        <p v-else class="mt-2 text-sm text-ink-muted">
          {{ $t('practice.noPrereqs') }}
        </p>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          {{ $t('practice.concepts') }}
        </p>
        <ul class="mt-3 space-y-3">
          <li
            v-for="(concept, index) in step.concepts"
            :key="index"
            class="rounded-xl border border-line bg-surface p-3"
          >
            <p class="text-sm font-semibold text-ink">
              {{ pickLocale(concept.term, lang) }}
            </p>
            <p class="mt-1 text-sm leading-6 text-ink-muted">
              {{ pickLocale(concept.explain, lang) }}
            </p>
          </li>
        </ul>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          {{ $t('practice.tasks') }}
        </p>
        <ol class="mt-3 space-y-3">
          <li
            v-for="(task, index) in step.tasks"
            :key="index"
            class="rounded-xl border border-line bg-surface p-3"
          >
            <p class="text-sm font-semibold text-ink">
              {{ index + 1 }}. {{ pickLocale(task.title, lang) }}
            </p>
            <p class="mt-1 text-sm leading-6 text-ink-muted">
              {{ pickLocale(task.detail, lang) }}
            </p>
            <div v-if="task.code" class="prose-doc mt-3 mb-0">
              <pre><code :class="task.code.lang ? `language-${task.code.lang}` : ''">{{ task.code.text }}</code></pre>
            </div>
          </li>
        </ol>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          {{ $t('practice.doneWhen') }}
        </p>
        <ul class="mt-3 space-y-2 text-sm leading-6 text-ink sm:text-base">
          <li
            v-for="(item, index) in step.doneWhen"
            :key="index"
            class="flex items-start gap-2"
          >
            <span class="mt-0.5 text-base text-accent-ink">☐</span>
            <span>{{ pickLocale(item, lang) }}</span>
          </li>
        </ul>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          {{ $t('practice.pitfalls') }}
        </p>
        <ul class="mt-3 space-y-2 text-sm leading-6 text-ink sm:text-base">
          <li
            v-for="(item, index) in step.pitfalls"
            :key="index"
            class="flex items-start gap-2"
          >
            <span class="mt-1 text-accent-ink">•</span>
            <span>{{ pickLocale(item, lang) }}</span>
          </li>
        </ul>
      </div>

      <div v-if="step.kbLinks.length">
        <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          {{ $t('practice.kbLinks') }}
        </p>
        <p class="mt-1 text-[11px] leading-4 text-ink-faint">
          {{ $t('practice.openNewTabHint') }}
        </p>
        <div class="mt-3 flex flex-wrap gap-2">
          <a
            v-for="link in step.kbLinks"
            :key="link.slug"
            :href="docsHref(lang, link.slug)"
            target="_blank"
            rel="noopener noreferrer"
            :class="linkClass"
          >
            {{ pickLocale(link.label, lang) }}
            <span class="ml-1 text-ink-faint" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div v-if="step.specRefs.length">
        <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          {{ $t('practice.specRefs') }}
        </p>
        <p class="mt-1 text-[11px] leading-4 text-ink-faint">
          {{ $t('practice.specRefsHint') }}
        </p>
        <div class="mt-3">
          <SpecRefLinks :refs="step.specRefs" :headings="headings" />
        </div>
      </div>

      <div v-if="step.questionLinks.length">
        <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          {{ $t('practice.qaLinks') }}
        </p>
        <p class="mt-1 text-[11px] leading-4 text-ink-faint">
          {{ $t('practice.openNewTabHint') }}
        </p>
        <div class="mt-3 flex flex-wrap gap-2">
          <a
            v-for="question in step.questionLinks"
            :key="question.id"
            :href="interviewHref(question.id)"
            target="_blank"
            rel="noopener noreferrer"
            :class="linkClass"
          >
            {{ pickLocale(question.label, lang) }}
            <span class="ml-1 text-ink-faint" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          {{ $t('practice.commit') }}
        </p>
        <div class="prose-doc mt-3 mb-0">
          <pre><code>{{ step.commit }}</code></pre>
        </div>
      </div>
    </section>

    <footer class="mt-8 flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:justify-between">
      <button
        type="button"
        class="min-h-11 rounded-lg border border-line bg-surface-elevated px-4 text-sm font-semibold text-ink disabled:opacity-40"
        :disabled="!prevId"
        @click="$emit('prev')"
      >
        {{ $t('practice.prev') }}
      </button>
      <button
        type="button"
        class="min-h-11 rounded-lg border border-line bg-surface-elevated px-4 text-sm font-semibold text-ink disabled:opacity-40"
        :disabled="!nextId"
        @click="$emit('next')"
      >
        {{ $t('practice.next') }}
      </button>
    </footer>
  </article>
</template>
