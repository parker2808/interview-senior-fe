<script setup lang="ts">
import BackLink from '@/modules/core/components/BackLink/BackLink.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import DocSidebar from '@/modules/knowledge-base/components/DocSidebar/DocSidebar.vue'
import DocToc from '@/modules/knowledge-base/components/DocToc/DocToc.vue'
import DocSearch from '@/modules/knowledge-base/components/DocSearch/DocSearch.vue'
import { useDocReader } from '@/modules/knowledge-base/composables/use-doc-reader.composable'
import { DOC_LANGS, type DocLang } from '@/modules/core/constants/locale.constant'
import { DEFAULT_DOC_SLUG } from '@/modules/knowledge-base/constants/doc-catalog.constant'
import { classifyKbHref } from '@/modules/knowledge-base/utils/kb-links.util'

const HEADER_OFFSET = 72

const route = useRoute()
const router = useRouter()
const { locale, setLocale, t } = useI18n()

const lang = computed(() => String(route.params.lang || 'vi'))
const slug = computed(() => String(route.params.slug || DEFAULT_DOC_SLUG))

const fromPlan = computed(() => {
  const raw = route.query.from
  return raw === 'plan' || (Array.isArray(raw) && raw[0] === 'plan')
})

const backTo = computed(() => (fromPlan.value ? '/plan' : '/'))
const backLabel = computed(() =>
  fromPlan.value ? t('docs.backPlan') : t('docs.backHub'),
)

const {
  catalog,
  flatTopics,
  safeLang,
  loaded,
  html,
  toc,
  adjacent,
  title,
  recent,
} = useDocReader(lang, slug)

const sidebarOpen = ref(false)
const searchOpen = ref(false)
const activeHeading = ref('')
const tocOpen = ref(false)
const proseRef = ref<HTMLElement | null>(null)

watch(
  safeLang,
  (l) => {
    if (locale.value !== l) setLocale(l)
  },
  { immediate: true },
)

function withFromQuery(path: string) {
  if (!fromPlan.value) return path
  const join = path.includes('?') ? '&' : '?'
  return `${path}${join}from=plan`
}

function goDoc(nextSlug: string, nextLang: string = safeLang.value) {
  router.push(withFromQuery(`/docs/${nextLang}/${nextSlug}`))
  sidebarOpen.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function switchLang(next: DocLang) {
  setLocale(next)
  const hash = import.meta.client ? window.location.hash : ''
  router.push(withFromQuery(`/docs/${next}/${slug.value}${hash}`))
}

watch(locale, (l) => {
  if (DOC_LANGS.includes(l as DocLang) && l !== safeLang.value) {
    switchLang(l as DocLang)
  }
})

function scrollToId(id: string, updateHash = true) {
  if (!id) return
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  if (updateHash) {
    history.replaceState(null, '', `#${id}`)
  }
  activeHeading.value = id
  tocOpen.value = false
}

function jumpTo(id: string) {
  scrollToId(id)
}

function onDocClick(e: MouseEvent) {
  const a = (e.target as HTMLElement | null)?.closest?.('a')
  if (!a) return
  const href = a.getAttribute('href')
  if (!href) return

  const result = classifyKbHref(href)

  if (result.kind === 'ignore') return

  if (result.kind === 'hash') {
    e.preventDefault()
    scrollToId(result.id)
    return
  }

  if (result.kind === 'external' || result.kind === 'github') {
    e.preventDefault()
    window.open(result.url, '_blank', 'noopener,noreferrer')
    return
  }

  if (result.kind === 'docs') {
    e.preventDefault()
    const nextLang = (result.lang || safeLang.value) as string
    const path = withFromQuery(`/docs/${nextLang}/${result.slug}`)
    router.push(result.hash ? `${path}#${result.hash}` : path)
  }
}

/** After HTML render / route hash change, scroll to target under sticky header. */
function syncHashScroll() {
  if (!import.meta.client) return
  const id = decodeURIComponent(window.location.hash.replace(/^#/, ''))
  if (!id) return
  nextTick(() => {
    requestAnimationFrame(() => scrollToId(id, false))
  })
}

watch(
  () => [html.value, route.fullPath] as const,
  () => syncHashScroll(),
  { flush: 'post' },
)

onMounted(() => {
  syncHashScroll()
  window.addEventListener('hashchange', syncHashScroll)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', syncHashScroll)
})

let observer: IntersectionObserver | null = null

watch(
  toc,
  (items) => {
    observer?.disconnect()
    if (!import.meta.client || !items.length) return
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]?.target?.id) {
          activeHeading.value = visible[0].target.id
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 1] },
    )
    nextTick(() => {
      for (const item of items) {
        const el = document.getElementById(item.id)
        if (el) observer?.observe(el)
      }
    })
  },
  { immediate: true },
)

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div class="docs-shell min-h-screen lg:h-dvh lg:overflow-hidden">
    <header
      class="docs-header sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur"
    >
      <div
        class="flex flex-wrap items-center gap-2 px-3 py-2 sm:px-4 lg:px-5"
      >
        <button
          type="button"
          class="inline-flex min-h-10 items-center rounded-lg border border-line bg-white px-3 text-sm font-semibold lg:hidden"
          @click="sidebarOpen = true"
        >
          {{ $t('docs.openNav') }}
        </button>

        <BackLink :to="backTo" :label="backLabel" />

        <div class="min-w-0 flex-1 basis-[40%] sm:basis-auto">
          <p class="truncate text-xs font-semibold uppercase tracking-wider text-accent-ink">
            {{ $t('docs.brand') }}
          </p>
          <p class="truncate text-sm font-semibold text-ink sm:text-base">
            {{ title }}
          </p>
        </div>

        <button
          type="button"
          class="inline-flex min-h-10 items-center rounded-lg border border-line bg-white px-3 text-sm font-semibold"
          @click="searchOpen = true"
        >
          <span class="sm:hidden">⌕</span>
          <span class="hidden sm:inline">{{ $t('docs.searchHint') }}</span>
        </button>

        <LocaleToggle />
      </div>
    </header>

    <div class="lg:flex lg:h-[calc(100dvh-var(--docs-header-h,3.5rem))]">
      <aside
        class="hidden w-64 shrink-0 border-r border-line bg-surface-elevated/70 lg:block xl:w-72"
      >
        <DocSidebar
          :catalog="catalog"
          :lang="safeLang"
          :active-slug="slug"
          :recent="recent"
          @select="goDoc"
        />
      </aside>

      <Teleport to="body">
        <div
          v-if="sidebarOpen"
          class="fixed inset-0 z-40 lg:hidden"
        >
          <div class="absolute inset-0 bg-ink/40" @click="sidebarOpen = false" />
          <aside
            class="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-surface-elevated shadow-xl"
          >
            <div class="flex items-center justify-between border-b border-line px-3 py-2">
              <BackLink :to="backTo" :label="backLabel" />
              <button
                type="button"
                class="min-h-10 rounded-lg px-3 text-sm font-semibold"
                @click="sidebarOpen = false"
              >
                {{ $t('docs.closeNav') }}
              </button>
            </div>
            <DocSidebar
              class="flex-1"
              :catalog="catalog"
              :lang="safeLang"
              :active-slug="slug"
              :recent="recent"
              @select="goDoc"
            />
          </aside>
        </div>
      </Teleport>

      <main class="docs-main min-w-0 flex-1 px-4 py-6 sm:px-6 lg:overflow-y-auto lg:px-8">
        <article v-if="loaded.ok" class="animate-fade-up mx-auto max-w-prose">
          <div
            ref="proseRef"
            class="prose-doc"
            v-html="html"
            @click="onDocClick"
          />

          <footer
            class="mt-10 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between"
          >
            <NuxtLink
              v-if="adjacent.prev"
              :to="withFromQuery(`/docs/${safeLang}/${adjacent.prev.slug}`)"
              class="inline-flex min-h-11 items-center rounded-lg border border-line bg-white px-4 text-sm font-semibold"
            >
              ← {{ $t('docs.prev') }}: {{ adjacent.prev.title[safeLang] }}
            </NuxtLink>
            <span v-else />
            <NuxtLink
              v-if="adjacent.next"
              :to="withFromQuery(`/docs/${safeLang}/${adjacent.next.slug}`)"
              class="inline-flex min-h-11 items-center rounded-lg border border-line bg-white px-4 text-sm font-semibold sm:ml-auto"
            >
              {{ $t('docs.next') }}: {{ adjacent.next.title[safeLang] }} →
            </NuxtLink>
          </footer>
        </article>
        <p v-else class="text-ink-muted">{{ $t('docs.notFound') }}</p>

        <div class="mt-8 lg:hidden">
          <button
            type="button"
            class="mb-2 min-h-10 rounded-lg border border-line bg-white px-3 text-sm font-semibold"
            @click="tocOpen = !tocOpen"
          >
            {{ $t('docs.onThisPage') }}
          </button>
          <DocToc
            v-if="tocOpen"
            :items="toc"
            :active-id="activeHeading"
            class="rounded-xl border border-line bg-surface-elevated"
            @navigate="jumpTo"
          />
        </div>
      </main>

      <aside
        class="hidden w-56 shrink-0 overflow-y-auto border-l border-line bg-surface-elevated/50 xl:block"
      >
        <DocToc
          :items="toc"
          :active-id="activeHeading"
          @navigate="jumpTo"
        />
      </aside>
    </div>

    <DocSearch
      v-model:open="searchOpen"
      :topics="flatTopics"
      :lang="safeLang"
      @select="goDoc"
    />
  </div>
</template>

<style scoped>
.docs-shell {
  --docs-header-h: 3.5rem;
}

@media (max-width: 639px) {
  .docs-shell {
    /* Wrapped header row on small phones */
    --docs-header-h: 5.5rem;
  }
}

.docs-main :deep(h1),
.docs-main :deep(h2),
.docs-main :deep(h3),
.docs-main :deep(h4),
.docs-main :deep(h5),
.docs-main :deep(h6) {
  scroll-margin-top: calc(var(--docs-header-h) + 0.75rem);
}

.docs-main :deep(a) {
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
  pointer-events: auto;
}
</style>
