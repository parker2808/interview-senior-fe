<script setup lang="ts">
import type {
  PracticeDesignGroup,
  PracticeDesignScreen,
  PracticeDesignTheme,
  TocItem,
} from '@/modules/content/types'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'
import SpecRefLinks from '@/modules/practice/components/SpecRefLinks/SpecRefLinks.vue'
import { designScreenSrc } from '@/modules/practice/utils/spec-ref.util'

const props = defineProps<{
  screens: PracticeDesignScreen[]
  headings: TocItem[]
}>()

const emit = defineEmits<{
  open: [index: number]
}>()

const { locale } = useI18n()
const lang = computed<'en' | 'vi'>(() => (locale.value === 'en' ? 'en' : 'vi'))

const group = ref<'all' | PracticeDesignGroup>('all')
const theme = ref<'all' | PracticeDesignTheme>('all')

const filtered = computed(() =>
  props.screens.filter((screen) => {
    if (group.value !== 'all' && screen.group !== group.value) return false
    if (theme.value !== 'all' && screen.theme !== theme.value) return false
    return true
  }),
)

function open(screen: PracticeDesignScreen) {
  const index = props.screens.findIndex((item) => item.id === screen.id)
  if (index >= 0) emit('open', index)
}

const chip =
  'inline-flex min-h-10 items-center rounded-lg border px-3 text-sm font-semibold transition'
function chipClass(on: boolean) {
  return on
    ? `${chip} border-accent bg-accent-soft text-accent-ink`
    : `${chip} border-line bg-surface-elevated text-ink hover:border-accent hover:text-accent-ink`
}
</script>

<template>
  <div>
    <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div class="flex flex-wrap items-center gap-2">
        <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          {{ $t('practice.filterGroup') }}
        </p>
        <button type="button" :class="chipClass(group === 'all')" @click="group = 'all'">
          {{ $t('practice.filterAll') }}
        </button>
        <button type="button" :class="chipClass(group === 'public')" @click="group = 'public'">
          {{ $t('practice.groupPublic') }}
        </button>
        <button type="button" :class="chipClass(group === 'admin')" @click="group = 'admin'">
          {{ $t('practice.groupAdmin') }}
        </button>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          {{ $t('practice.filterTheme') }}
        </p>
        <button type="button" :class="chipClass(theme === 'all')" @click="theme = 'all'">
          {{ $t('practice.filterAll') }}
        </button>
        <button type="button" :class="chipClass(theme === 'light')" @click="theme = 'light'">
          {{ $t('practice.themeLight') }}
        </button>
        <button type="button" :class="chipClass(theme === 'dark')" @click="theme = 'dark'">
          {{ $t('practice.themeDark') }}
        </button>
      </div>
    </div>

    <p
      v-if="!filtered.length"
      class="mt-6 rounded-2xl border border-line bg-surface-elevated px-4 py-10 text-center text-sm text-ink-muted"
    >
      {{ $t('practice.emptyScreens') }}
    </p>
    <ul
      v-else
      class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <li v-for="screen in filtered" :key="screen.id">
        <article
          class="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface-elevated shadow-sm transition hover:border-accent hover:shadow-md"
        >
          <button
            type="button"
            class="group block w-full overflow-hidden bg-surface text-left"
            :aria-label="pickLocale(screen.title, lang)"
            @click="open(screen)"
          >
            <img
              :src="designScreenSrc(screen.file)"
              :alt="pickLocale(screen.title, lang)"
              :width="screen.width"
              :height="screen.height"
              loading="lazy"
              decoding="async"
              class="h-auto w-full object-cover object-top transition group-hover:opacity-95"
              :style="{ aspectRatio: `${screen.width} / ${Math.min(screen.height, Math.round(screen.width * 0.72))}` }"
            />
          </button>
          <div class="flex flex-1 flex-col gap-2 p-4">
            <div class="flex flex-wrap gap-1.5">
              <span class="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent-ink">
                {{ screen.group === 'admin' ? $t('practice.groupAdmin') : $t('practice.groupPublic') }}
              </span>
              <span class="rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold text-ink-muted">
                {{ screen.theme === 'dark' ? $t('practice.themeDark') : $t('practice.themeLight') }}
              </span>
              <span class="rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold text-ink-muted">
                {{
                  screen.viewport === 'mobile'
                    ? $t('practice.viewportMobile')
                    : $t('practice.viewportDesktop')
                }}
              </span>
            </div>
            <h2 class="text-base font-semibold text-ink">
              {{ pickLocale(screen.title, lang) }}
            </h2>
            <p class="text-sm leading-6 text-ink-muted">
              {{ pickLocale(screen.caption, lang) }}
            </p>
            <SpecRefLinks
              class="mt-auto pt-1"
              :refs="screen.specRefs"
              :headings="headings"
            />
          </div>
        </article>
      </li>
    </ul>
  </div>
</template>
