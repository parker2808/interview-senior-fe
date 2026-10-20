<script setup lang="ts">
import type { TocItem } from '@/modules/content/types'
import DocToc from '@/modules/knowledge-base/components/DocToc/DocToc.vue'
import {
  matchingSpecHeadingIds,
  renderSpecMarkdown,
} from '@/modules/practice/utils/spec-ref.util'

const HEADER_OFFSET = 72

const props = withDefaults(
  defineProps<{
    markdown: string
    headings: TocItem[]
    hideToc?: boolean
    scrollRoot?: HTMLElement | null
  }>(),
  {
    hideToc: false,
    scrollRoot: null,
  },
)

const { t } = useI18n()
const query = ref('')
const activeHeading = ref('')
const tocOpen = ref(false)
const proseRef = ref<HTMLElement | null>(null)

const rendered = computed(() => renderSpecMarkdown(props.markdown))
const hitIds = computed(() =>
  matchingSpecHeadingIds(props.markdown, props.headings, query.value),
)
const tocItems = computed(() => {
  if (!query.value.trim()) return props.headings.length ? props.headings : rendered.value.toc
  const allow = new Set(hitIds.value)
  const source = props.headings.length ? props.headings : rendered.value.toc
  return source.filter((item) => allow.has(item.id))
})

function headingEls() {
  const root = proseRef.value
  if (!root) return []
  return Array.from(root.querySelectorAll<HTMLElement>('h1,h2,h3,h4,h5,h6')).filter(
    (el) => el.id,
  )
}

function scrollContainer(): HTMLElement | Window {
  if (props.scrollRoot) return props.scrollRoot
  if (import.meta.client) {
    const pane = document.querySelector<HTMLElement>('.docs-main')
    if (pane) return pane
  }
  return window
}

function scrollToId(id: string, smooth = true) {
  if (!id) return
  const el = document.getElementById(id)
  if (!el) return
  const container = scrollContainer()
  if (container === window) {
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
    window.scrollTo({ top: Math.max(0, top), behavior: smooth ? 'smooth' : 'auto' })
  } else {
    const root = container as HTMLElement
    const top =
      el.getBoundingClientRect().top -
      root.getBoundingClientRect().top +
      root.scrollTop -
      HEADER_OFFSET
    root.scrollTo({ top: Math.max(0, top), behavior: smooth ? 'smooth' : 'auto' })
  }
  activeHeading.value = id
  if (import.meta.client) {
    const url = new URL(window.location.href)
    url.hash = id
    history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`)
  }
}

function jumpTo(id: string) {
  tocOpen.value = false
  scrollToId(id, true)
}

defineExpose({ jumpTo, activeHeading, tocItems })

function syncActiveFromScroll() {
  const headings = headingEls()
  let current = headings[0]?.id || ''
  for (const el of headings) {
    if (el.getBoundingClientRect().top <= HEADER_OFFSET + 12) current = el.id
    else break
  }
  if (current) activeHeading.value = current
}

function applyHash() {
  if (!import.meta.client) return
  const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''))
  if (hash) {
    nextTick(() => scrollToId(hash, false))
    return
  }
  const firstHit = hitIds.value[0]
  if (query.value.trim() && firstHit) {
    nextTick(() => scrollToId(firstHit, true))
  }
}

let scrollBound = false
let boundTarget: HTMLElement | Window | null = null
onMounted(() => {
  boundTarget = scrollContainer()
  boundTarget.addEventListener('scroll', syncActiveFromScroll, { passive: true })
  scrollBound = true
  nextTick(() => applyHash())
})
onUnmounted(() => {
  if (scrollBound && boundTarget) {
    boundTarget.removeEventListener('scroll', syncActiveFromScroll)
  }
})

watch(
  () => props.markdown,
  () => nextTick(() => applyHash()),
)

watch(query, () => {
  if (!query.value.trim()) return
  const first = hitIds.value[0]
  if (first) nextTick(() => scrollToId(first, true))
})
</script>

<template>
  <div
    :class="
      hideToc ? '' : 'lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start lg:gap-6'
    "
  >
    <div class="min-w-0">
      <label class="sr-only" for="design-spec-search">{{ t('practice.specSearch') }}</label>
      <input
        id="design-spec-search"
        v-model="query"
        type="search"
        class="min-h-11 w-full rounded-lg border border-line bg-surface-elevated px-3 text-sm text-ink outline-none focus:border-accent"
        :placeholder="t('practice.specSearch')"
      />
      <p
        v-if="query.trim() && !tocItems.length"
        class="mt-4 rounded-2xl border border-line bg-surface-elevated px-4 py-8 text-center text-sm text-ink-muted"
      >
        {{ t('practice.emptySpecSearch') }}
      </p>
      <div
        v-else-if="markdown.trim()"
        ref="proseRef"
        class="prose-doc mt-5"
        v-html="rendered.html"
      />
      <p
        v-else
        class="mt-4 rounded-2xl border border-line bg-surface-elevated px-4 py-8 text-center text-sm text-ink-muted"
      >
        {{ t('practice.specMissing') }}
      </p>
    </div>

    <div v-if="!hideToc" class="mt-6 lg:mt-0">
      <button
        type="button"
        class="mb-2 min-h-10 rounded-lg border border-line bg-surface-elevated px-3 text-sm font-semibold lg:hidden"
        @click="tocOpen = !tocOpen"
      >
        {{ t('docs.onThisPage') }}
      </button>
      <aside
        class="lg:sticky lg:top-20"
        :class="tocOpen ? 'block' : 'hidden lg:block'"
      >
        <DocToc
          :items="tocItems"
          :active-id="activeHeading"
          class="max-h-[min(24rem,50vh)] overflow-y-auto rounded-xl border border-line bg-surface-elevated lg:max-h-[calc(100dvh-7rem)]"
          @navigate="jumpTo"
        />
      </aside>
    </div>
  </div>
</template>
