<script setup lang="ts">
import BackLink from '@/modules/core/components/BackLink/BackLink.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import DocSidebar from '@/modules/knowledge-base/components/DocSidebar/DocSidebar.vue'
import DocToc from '@/modules/knowledge-base/components/DocToc/DocToc.vue'
import DocSearch from '@/modules/knowledge-base/components/DocSearch/DocSearch.vue'
import { useDocReader } from '@/modules/knowledge-base/composables/use-doc-reader.composable'
import { DOC_LANGS, type DocLang } from '@/modules/core/constants/locale.constant'
import { DEFAULT_DOC_SLUG } from '@/modules/knowledge-base/constants/doc-catalog.constant'

const route = useRoute()
const router = useRouter()
const { locale, setLocale } = useI18n()

const lang = computed(() => String(route.params.lang || 'vi'))
const slug = computed(() => String(route.params.slug || DEFAULT_DOC_SLUG))

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

watch(
  safeLang,
  (l) => {
    if (locale.value !== l) setLocale(l)
  },
  { immediate: true },
)

function goDoc(nextSlug: string, nextLang: string = safeLang.value) {
  router.push(`/docs/${nextLang}/${nextSlug}`)
  sidebarOpen.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function switchLang(next: DocLang) {
  setLocale(next)
  const hash = import.meta.client ? window.location.hash : ''
  router.push(`/docs/${next}/${slug.value}${hash}`)
}

watch(locale, (l) => {
  if (DOC_LANGS.includes(l as DocLang) && l !== safeLang.value) {
    switchLang(l as DocLang)
  }
})

function jumpTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
  activeHeading.value = id
  tocOpen.value = false
}

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
  <div class="min-h-screen lg:h-screen lg:overflow-hidden">
    <header
      class="sticky top-0 z-30 flex flex-wrap items-center gap-2 border-b border-line bg-surface/90 px-3 py-2.5 backdrop-blur sm:px-4 lg:px-5"
    >
      <button
        type="button"
        class="inline-flex min-h-10 items-center rounded-lg border border-line bg-white px-3 text-sm font-semibold lg:hidden"
        @click="sidebarOpen = true"
      >
        {{ $t('docs.openNav') }}
      </button>

      <BackLink class="hidden sm:inline-flex" />

      <div class="min-w-0 flex-1">
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
    </header>

    <div class="lg:flex lg:h-[calc(100vh-3.75rem)]">
      <!-- Desktop sidebar -->
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

      <!-- Mobile drawer -->
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
              <BackLink />
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

      <main class="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <article v-if="loaded.ok" class="animate-fade-up mx-auto max-w-prose">
          <div class="prose-doc" v-html="html" />

          <footer
            class="mt-10 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between"
          >
            <NuxtLink
              v-if="adjacent.prev"
              :to="`/docs/${safeLang}/${adjacent.prev.slug}`"
              class="inline-flex min-h-11 items-center rounded-lg border border-line bg-white px-4 text-sm font-semibold"
            >
              ← {{ $t('docs.prev') }}: {{ adjacent.prev.title[safeLang] }}
            </NuxtLink>
            <span v-else />
            <NuxtLink
              v-if="adjacent.next"
              :to="`/docs/${safeLang}/${adjacent.next.slug}`"
              class="inline-flex min-h-11 items-center rounded-lg border border-line bg-white px-4 text-sm font-semibold sm:ml-auto"
            >
              {{ $t('docs.next') }}: {{ adjacent.next.title[safeLang] }} →
            </NuxtLink>
          </footer>
        </article>
        <p v-else class="text-ink-muted">{{ $t('docs.notFound') }}</p>

        <!-- Tablet/mobile TOC -->
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
