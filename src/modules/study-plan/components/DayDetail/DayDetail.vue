<script setup lang="ts">
import type { PlanDay } from '@/modules/content/types'
import PlanDayContent from '@/modules/study-plan/components/PlanDayContent/PlanDayContent.vue'
import BlockRenderer from '@/modules/content/components/BlockRenderer/BlockRenderer.vue'
import { classifyContentHref } from '@/modules/content/utils/content-links.util'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'
import { usePlanIndex } from '@/modules/study-plan/composables/use-plan-index.composable'

const props = defineProps<{
  day: PlanDay
  done: boolean
  readOnly: boolean
}>()

const emit = defineEmits<{
  toggle: []
  prev: []
  next: []
  'open-doc': [path: string]
  'open-docs': [payload: { lang: string; slug: string; hash?: string }]
}>()

type DayTab = 'plan' | 'lab'
const { locale } = useI18n()
const { data: plan } = usePlanIndex()

const lang = computed<'en' | 'vi'>(() =>
  locale.value === 'en' ? 'en' : 'vi',
)

const tab = ref<DayTab>('plan')

watch(
  () => props.day.day,
  () => {
    tab.value = 'plan'
  },
)

const aliases = computed(() =>
  (plan.value?.resources ?? []).flatMap((item) => [item.id, ...item.aliases]),
)

function onDocClick(e: MouseEvent) {
  const a = (e.target as HTMLElement).closest('a')
  if (!a) return
  const href = a.getAttribute('href')
  const result = classifyContentHref(
    href || '',
    props.day.lab.resourceId,
    aliases.value,
  )
  if (result.kind === 'ignore' || result.kind === 'hash') return
  e.preventDefault()
  if (result.kind === 'external' || result.kind === 'github') {
    window.open(result.url, '_blank', 'noopener,noreferrer')
    return
  }
  if (result.kind === 'docs') {
    emit('open-docs', {
      lang: result.lang || lang.value,
      slug: result.slug,
      hash: result.hash,
    })
    return
  }
  if (result.kind === 'plan') {
    emit('open-doc', result.path)
  }
}
</script>

<template>
  <article class="animate-fade-up rounded-2xl border border-line bg-surface-elevated p-4 sm:p-6">
    <header class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-accent-ink">
          Day {{ String(day.day).padStart(2, '0') }} · {{ day.date }}
        </p>
        <h2 class="mt-1 text-xl font-bold sm:text-2xl">
          {{ pickLocale(day.title, lang) }}
        </h2>
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
                ? $t('plan.doneReadOnly')
                : $t('plan.pendingReadOnly')
              : done
                ? $t('plan.done')
                : $t('plan.markDone')
          }}
        </span>
      </label>
    </header>

    <div class="mb-3 flex flex-wrap gap-2" role="tablist">
      <button
        type="button"
        role="tab"
        class="min-h-10 rounded-lg px-3 text-sm font-semibold"
        :class="tab === 'plan' ? 'bg-accent text-[var(--bg-elevated)]' : 'border border-line bg-surface-elevated text-ink'"
        :aria-selected="tab === 'plan'"
        @click="tab = 'plan'"
      >
        {{ $t('plan.tabPlan') }}
      </button>
      <button
        type="button"
        role="tab"
        class="min-h-10 rounded-lg px-3 text-sm font-semibold"
        :class="tab === 'lab' ? 'bg-accent text-[var(--bg-elevated)]' : 'border border-line bg-surface-elevated text-ink'"
        :aria-selected="tab === 'lab'"
        @click="tab = 'lab'"
      >
        {{ $t('plan.tabLab') }}
      </button>
    </div>

    <PlanDayContent v-if="tab === 'plan'" :content="day" />

    <BlockRenderer
      v-if="tab === 'lab'"
      :sections="day.lab.sections"
      :lang="lang"
      @click="onDocClick"
    />

    <footer class="mt-8 flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:justify-between">
      <button
        type="button"
        class="min-h-11 rounded-lg border border-line bg-surface-elevated px-4 text-sm font-semibold text-ink disabled:opacity-40"
        :disabled="day.day <= 1"
        @click="$emit('prev')"
      >
        {{ $t('plan.prevDay') }}
      </button>
      <button
        type="button"
        class="min-h-11 rounded-lg border border-line bg-surface-elevated px-4 text-sm font-semibold text-ink disabled:opacity-40"
        :disabled="day.day >= 30"
        @click="$emit('next')"
      >
        {{ $t('plan.nextDay') }}
      </button>
    </footer>
  </article>
</template>
