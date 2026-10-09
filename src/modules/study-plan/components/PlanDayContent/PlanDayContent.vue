<script setup lang="ts">
import type {
  StudyPlanDayContent,
} from '@/modules/study-plan/constants/plan-content.constant'
import {
  docsHref,
  interviewHref,
} from '@/modules/study-plan/utils/open-app-link.util'

const props = defineProps<{
  content: StudyPlanDayContent
}>()

const router = useRouter()
const { locale } = useI18n()

const lang = computed<'en' | 'vi'>(() =>
  locale.value === 'en' ? 'en' : 'vi',
)

const linkClass =
  'inline-flex min-h-10 items-center rounded-lg border border-line bg-surface px-3 text-sm font-medium text-ink transition hover:border-accent hover:text-accent-ink'

function openPlanDoc(path: string) {
  router.push(`/plan/doc/${encodeURIComponent(path)}`)
}

function openAlgo() {
  openPlanDoc(props.content.algorithm.path)
}
</script>

<template>
  <div class="space-y-5">
    <section>
      <p class="text-xs font-semibold uppercase tracking-wider text-accent-ink">
        {{ $t('plan.goal') }}
      </p>
      <p class="mt-2 text-sm leading-6 text-ink sm:text-base">
        {{ content.goal[lang] }}
      </p>
    </section>

    <div class="grid gap-4 lg:grid-cols-2">
      <section class="rounded-xl border border-line bg-surface-elevated p-3">
        <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          {{ $t('plan.study') }}
        </p>
        <p class="mt-1 text-[11px] leading-4 text-ink-faint">
          {{ $t('plan.openNewTabHint') }}
        </p>
        <div class="mt-3 flex flex-wrap gap-2">
          <a
            v-for="link in content.studyLinks.filter((item) => item.kind === 'docs')"
            :key="`docs:${link.slug}`"
            :href="docsHref(lang, link.slug)"
            target="_blank"
            rel="noopener noreferrer"
            :class="linkClass"
          >
            {{ link.label[lang] }}
            <span class="ml-1 text-ink-faint" aria-hidden="true">↗</span>
          </a>
          <button
            v-for="link in content.studyLinks.filter((item) => item.kind === 'plan')"
            :key="`plan:${link.path}`"
            type="button"
            :class="linkClass"
            @click="openPlanDoc(link.path)"
          >
            {{ link.label[lang] }}
          </button>
        </div>
      </section>

      <section class="rounded-xl border border-line bg-surface-elevated p-3">
        <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          {{ $t('plan.qa') }}
        </p>
        <p class="mt-1 text-[11px] leading-4 text-ink-faint">
          {{ $t('plan.openNewTabHint') }}
        </p>
        <div class="mt-3 flex flex-wrap gap-2">
          <a
            v-for="question in content.questionLinks"
            :key="question.id"
            :href="interviewHref(question.id)"
            target="_blank"
            rel="noopener noreferrer"
            :class="linkClass"
          >
            {{ question.label[lang] }}
            <span class="ml-1 text-ink-faint" aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </div>

    <section class="rounded-xl border border-line bg-surface-elevated p-3">
      <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
        {{ $t('plan.handsOn') }}
      </p>
      <ul class="mt-3 space-y-2 text-sm leading-6 text-ink sm:text-base">
        <li
          v-for="(item, index) in content.handsOn"
          :key="index"
          class="flex items-start gap-2"
        >
          <span class="mt-1 text-accent-ink">•</span>
          <span>{{ item[lang] }}</span>
        </li>
      </ul>
    </section>

    <section class="rounded-xl border border-line bg-surface-elevated p-3">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
            {{ $t('plan.algorithm') }}
          </p>
          <p class="mt-2 text-sm leading-6 text-ink sm:text-base">
            {{ content.algorithm.label[lang] }}
          </p>
        </div>
        <button
          type="button"
          :class="linkClass"
          @click="openAlgo"
        >
          {{ $t('plan.open') }}
        </button>
      </div>
    </section>

    <section class="rounded-xl border border-line bg-surface-elevated p-3">
      <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
        {{ $t('plan.checklist') }}
      </p>
      <ul class="mt-3 space-y-2 text-sm leading-6 text-ink sm:text-base">
        <li
          v-for="(item, index) in content.checklist"
          :key="index"
          class="flex items-start gap-2"
        >
          <span class="mt-0.5 text-base text-accent-ink">☐</span>
          <span>{{ item[lang] }}</span>
        </li>
      </ul>
    </section>

    <p
      v-if="content.note"
      class="rounded-xl border border-dashed border-line bg-surface px-3 py-2 text-sm leading-6 text-ink-muted"
    >
      {{ content.note[lang] }}
    </p>
  </div>
</template>
