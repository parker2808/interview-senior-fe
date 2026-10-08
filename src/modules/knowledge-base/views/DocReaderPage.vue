<script setup lang="ts">
import AppTopBar from '@/modules/core/components/AppTopBar/AppTopBar.vue'
import BackLink from '@/modules/core/components/BackLink/BackLink.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'
import DocSidebar from '@/modules/knowledge-base/components/DocSidebar/DocSidebar.vue'
import DocToc from '@/modules/knowledge-base/components/DocToc/DocToc.vue'
import DocSearch from '@/modules/knowledge-base/components/DocSearch/DocSearch.vue'
import { useDocReader } from '@/modules/knowledge-base/composables/use-doc-reader.composable'
import { DOC_LANGS, type DocLang } from '@/modules/core/constants/locale.constant'
import { DEFAULT_DOC_SLUG } from '@/modules/knowledge-base/constants/doc-catalog.constant'
import { classifyKbHref } from '@/modules/knowledge-base/utils/kb-links.util'

const HEADER_OFFSET = 56

const route = useRoute()
const router = useRouter()
const { locale, setLocale, t } = useI18n()

const lang = computed(() => String(route.params.lang || 'vi'))
const slug = computed(() => String(route.params.slug || DEFAULT_DOC_SLUG))

const fromPlan = computed(() => {
  const raw = route.query.from
  return raw === 'plan' || (Array.isArray(raw) && raw[0] === 'plan')
})

const parentTo = computed(() => (fromPlan.value ? '/plan' : undefined))
const backTo = computed(() => (fromPlan.value ? '/plan' : '/'))
const backLabel = computed(() =>
  fromPlan.value ? t('docs.backPlan') : t('docs.backHub'),
)

const {
  catalog,
  safeLang,
  loaded,
  html,
  toc,
  adjacent,
  title,
} = useDocReader(lang, slug)

const sidebarOpen = ref(false)
const searchOpen = ref(false)
const activeHeading = ref('')
const tocOpen = ref(false)
const proseRef = ref<HTMLElement | null>(null)
const mainRef = ref<HTMLElement | null>(null)
const topBarHeight = ref(56)
const headerOffset = ref(HEADER_OFFSET)

/** Preserve reading position across VI↔EN on the same slug */
const langPreserve = ref<{
  tocIndex: number
  ratio: number
} | null>(null)

/** Docs shell always scrolls inside `.docs-main` (all breakpoints). */
function scrollEl(): HTMLElement | Window {
  if (import.meta.client && mainRef.value) return mainRef.value
  return window
}

function getScrollTop() {
  const el = scrollEl()
  return el === window ? window.scrollY : (el as HTMLElement).scrollTop
}

function setScrollTop(top: number, smooth = false) {
  const el = scrollEl()
  const opts: ScrollToOptions = {
    top: Math.max(0, top),
    behavior: smooth ? 'smooth' : 'auto',
  }
  if (el === window) window.scrollTo(opts)
  else (el as HTMLElement).scrollTo(opts)
}

function getScrollHeight() {
  const el = scrollEl()
  if (el === window) {
    return Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1,
    )
  }
  const node = el as HTMLElement
  return Math.max(node.scrollHeight - node.clientHeight, 1)
}

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

function goDoc(
  nextSlug: string,
  nextLang: string = safeLang.value,
  hash?: string,
) {
  langPreserve.value = null
  const base = withFromQuery(`/docs/${nextLang}/${nextSlug}`)
  const path = hash ? `${base}#${hash}` : base
  router.push(path)
  sidebarOpen.value = false
  if (!hash) nextTick(() => setScrollTop(0))
}

function onSearchSelect(payload: { slug: string; hash?: string }) {
  goDoc(payload.slug, safeLang.value, payload.hash)
  if (payload.hash) {
    nextTick(() => {
      requestAnimationFrame(() => scrollToId(payload.hash!, true, true))
    })
  }
}

function switchLang(next: DocLang) {
  if (!import.meta.client) {
    setLocale(next)
    return
  }
  const tocIndex = toc.value.findIndex((item) => item.id === activeHeading.value)
  langPreserve.value = {
    tocIndex: tocIndex >= 0 ? tocIndex : -1,
    ratio: getScrollTop() / getScrollHeight(),
  }
  setLocale(next)
  const hash = window.location.hash
  router.push(withFromQuery(`/docs/${next}/${slug.value}${hash}`))
}

watch(locale, (l) => {
  if (DOC_LANGS.includes(l as DocLang) && l !== safeLang.value) {
    switchLang(l as DocLang)
  }
})

function scrollToId(id: string, updateHash = true, smooth = true) {
  if (!id) return
  const el = document.getElementById(id)
  if (!el) return
  const container = scrollEl()
  if (container === window) {
    const top =
      el.getBoundingClientRect().top + window.scrollY - headerOffset.value
    setScrollTop(top, smooth)
  } else {
    const root = container as HTMLElement
    const top =
      el.getBoundingClientRect().top -
      root.getBoundingClientRect().top +
      root.scrollTop -
      headerOffset.value
    setScrollTop(top, smooth)
  }
  if (updateHash) {
    history.replaceState(null, '', `#${id}`)
  }
  activeHeading.value = id
  tocOpen.value = false
}

function jumpTo(id: string) {
  scrollToId(id)
}

function onTopBarHeightChange(height: number) {
  topBarHeight.value = height
  headerOffset.value = height + 8
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
    requestAnimationFrame(() => scrollToId(id, false, false))
  })
}

function restoreLangScroll() {
  const preserved = langPreserve.value
  if (!preserved) return
  langPreserve.value = null
  nextTick(() => {
    requestAnimationFrame(() => {
      if (preserved.tocIndex >= 0 && toc.value[preserved.tocIndex]) {
        scrollToId(toc.value[preserved.tocIndex].id, true, false)
        return
      }
      setScrollTop(preserved.ratio * getScrollHeight(), false)
    })
  })
}

watch(
  () => [html.value, route.fullPath] as const,
  () => {
    if (langPreserve.value) restoreLangScroll()
    else syncHashScroll()
  },
  { flush: 'post' },
)

onMounted(() => {
  // Lock document scroll so only `.docs-main` scrolls (tablet/desktop).
  document.documentElement.classList.add('docs-lock-scroll')
  document.body.classList.add('docs-lock-scroll')

  syncHashScroll()
  window.addEventListener('hashchange', syncHashScroll)
})

onUnmounted(() => {
  document.documentElement.classList.remove('docs-lock-scroll')
  document.body.classList.remove('docs-lock-scroll')
  window.removeEventListener('hashchange', syncHashScroll)
})

let observer: IntersectionObserver | null = null

function bindHeadingObserver() {
  observer?.disconnect()
  observer = null
  if (!import.meta.client || !toc.value.length || !mainRef.value) return
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]?.target?.id) {
        activeHeading.value = visible[0].target.id
      }
    },
    {
      root: mainRef.value,
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0, 1],
    },
  )
  nextTick(() => {
    for (const item of toc.value) {
      const el = document.getElementById(item.id)
      if (el) observer?.observe(el)
    }
  })
}

watch([toc, mainRef], () => bindHeadingObserver(), { immediate: true })

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div
    class="docs-shell flex h-dvh max-h-dvh flex-col overflow-hidden"
    :style="{ '--docs-header-h': `${topBarHeight}px` }"
  >
    <AppTopBar
      :title="title"
      :home-label="$t('docs.backHub')"
      :back-to="parentTo"
      :back-label="backLabel"
      :lock-visible="sidebarOpen || searchOpen || tocOpen"
      :scroll-target="mainRef"
      inner-class="px-2 sm:px-4 lg:px-5"
      @heightchange="onTopBarHeightChange"
    >
      <template #leading>
        <button
          type="button"
          class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-ink lg:hidden"
          :aria-label="$t('docs.openNav')"
          :title="$t('docs.openNav')"
          @click="sidebarOpen = true"
        >
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </template>

      <template #actions>
        <button
          type="button"
          class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-ink"
          :aria-label="$t('docs.searchPlaceholder')"
          :title="$t('docs.searchHint')"
          @click="searchOpen = true"
        >
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3-3" />
          </svg>
        </button>

        <LocaleToggle />
        <ThemeToggle />
      </template>
    </AppTopBar>

    <div class="flex min-h-0 flex-1 flex-col lg:flex-row">
      <aside
        class="hidden w-64 shrink-0 overflow-y-auto border-r border-line bg-surface-elevated/70 lg:block xl:w-72"
      >
        <DocSidebar
          :catalog="catalog"
          :lang="safeLang"
          :active-slug="slug"
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
              <BackLink :to="backTo" :label="backLabel" icon-only />
              <button
                type="button"
                class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink"
                :aria-label="$t('docs.closeNav')"
                :title="$t('docs.closeNav')"
                @click="sidebarOpen = false"
              >
                <svg
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <DocSidebar
              class="flex-1"
              :catalog="catalog"
              :lang="safeLang"
              :active-slug="slug"
              @select="goDoc"
            />
          </aside>
        </div>
      </Teleport>

      <main
        ref="mainRef"
        class="docs-main min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8"
      >
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
      :lang="safeLang"
      @select="onSearchSelect"
    />
  </div>
</template>

<style scoped>
.docs-shell {
  --docs-header-h: 3rem;
}

.docs-main {
  scroll-padding-top: calc(var(--docs-header-h) + 0.75rem);
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
