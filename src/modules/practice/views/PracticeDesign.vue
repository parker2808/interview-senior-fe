<script setup lang="ts">
import AppTopBar from '@/modules/core/components/AppTopBar/AppTopBar.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'
import PracticeSubnav from '@/modules/practice/components/PracticeSubnav/PracticeSubnav.vue'
import DesignGallery from '@/modules/practice/components/DesignGallery/DesignGallery.vue'
import DesignLightbox from '@/modules/practice/components/DesignLightbox/DesignLightbox.vue'
import DesignSpec from '@/modules/practice/components/DesignSpec/DesignSpec.vue'
import {
  usePracticeDesign,
  usePracticeDesignAvailable,
} from '@/modules/practice/composables/use-practice-index.composable'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'
import ContentSkeleton from '@/modules/content/components/ContentSkeleton/ContentSkeleton.vue'
import ContentStatus from '@/modules/content/components/ContentStatus/ContentStatus.vue'

const route = useRoute()
const router = useRouter()
const { locale, t } = useI18n()
const lang = computed<'en' | 'vi'>(() => (locale.value === 'en' ? 'en' : 'vi'))

const { data: design, pending, error, refresh } = await usePracticeDesign()
const { data: designAvailable } = await usePracticeDesignAvailable()

const retrying = ref(false)
async function retry() {
  retrying.value = true
  try {
    await refresh()
  } finally {
    retrying.value = false
  }
}

const notFound = computed(() => {
  const err = error.value as { statusCode?: number; status?: number } | null
  const status = Number(err?.statusCode || err?.status || 0)
  return status === 404
})

const tab = computed<'screens' | 'spec'>(() =>
  String(route.query.tab || '') === 'spec' ? 'spec' : 'screens',
)

function setTab(next: 'screens' | 'spec') {
  const query = { ...route.query }
  if (next === 'spec') query.tab = 'spec'
  else delete query.tab
  router.replace({ path: '/practice/design', query, hash: next === 'spec' ? route.hash : '' })
}

function syncTabFromHash() {
  if (route.hash && tab.value !== 'spec') setTab('spec')
}

onMounted(() => syncTabFromHash())
watch(
  () => route.hash,
  () => syncTabFromHash(),
)

const lightboxIndex = ref<number | null>(null)
const lightboxOpen = computed(() => lightboxIndex.value != null)

function openLightbox(index: number) {
  lightboxIndex.value = index
}
function closeLightbox() {
  lightboxIndex.value = null
}

const tabClass = (on: boolean) =>
  on
    ? 'border-accent bg-accent-soft text-accent-ink'
    : 'border-line bg-surface-elevated text-ink hover:border-accent hover:text-accent-ink'
</script>

<template>
  <div class="mx-auto min-h-screen max-w-hub pb-10">
    <AppTopBar
      :title="
        design ? pickLocale(design.index.title, lang) : t('practice.designTitle')
      "
      :home-label="t('practice.backHub')"
      back-to="/practice"
      :back-label="t('practice.backList')"
    >
      <template #actions>
        <a
          href="/docs"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-elevated text-ink transition hover:border-accent hover:text-accent-ink"
          :aria-label="t('practice.openDocs')"
          :title="t('practice.openDocs')"
        >
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </a>
        <LocaleToggle />
        <ThemeToggle />
      </template>
    </AppTopBar>

    <ContentSkeleton
      v-if="pending && !design"
      variant="practice-design"
      class="px-4 pt-5 sm:px-6 sm:pt-8"
    />
    <ContentStatus
      v-else-if="error && !notFound"
      class="mx-4 mt-5 sm:mx-6"
      kind="error"
      :message="t('practice.loadError')"
      :retrying="retrying"
      @retry="retry"
    />
    <ContentStatus
      v-else-if="!design"
      class="mx-4 mt-5 sm:mx-6"
      kind="empty"
      :message="t('practice.emptyDesign')"
    />
    <div v-else class="animate-fade-up px-4 pt-5 sm:px-6 sm:pt-8">
      <header class="border-b border-line pb-5">
        <p class="text-xs font-semibold uppercase tracking-wider text-accent-ink">
          {{ t('practice.designEyebrow') }}
        </p>
        <h1 class="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {{ pickLocale(design.index.title, lang) }}
        </h1>
        <p class="mt-2 max-w-3xl text-sm leading-6 text-ink-muted">
          {{ pickLocale(design.index.intro, lang) }}
        </p>
        <div class="mt-4">
          <PracticeSubnav active="design" :design-available="designAvailable !== false" />
        </div>
      </header>

      <div
        class="mt-5 flex flex-wrap gap-2"
        role="tablist"
        :aria-label="t('practice.designTitle')"
      >
        <button
          type="button"
          role="tab"
          class="inline-flex min-h-11 items-center rounded-lg border px-4 text-sm font-semibold transition"
          :class="tabClass(tab === 'screens')"
          :aria-selected="tab === 'screens'"
          @click="setTab('screens')"
        >
          {{ t('practice.tabScreens') }}
        </button>
        <button
          type="button"
          role="tab"
          class="inline-flex min-h-11 items-center rounded-lg border px-4 text-sm font-semibold transition"
          :class="tabClass(tab === 'spec')"
          :aria-selected="tab === 'spec'"
          @click="setTab('spec')"
        >
          {{ t('practice.tabSpec') }}
        </button>
      </div>

      <section class="mt-6 pb-10">
        <DesignGallery
          v-if="tab === 'screens'"
          :screens="design.index.screens"
          :headings="design.headings"
          @open="openLightbox"
        />
        <DesignSpec
          v-else
          :markdown="design.specMarkdown"
          :headings="design.headings"
        />
      </section>
    </div>

    <ClientOnly>
      <DesignLightbox
        v-if="lightboxOpen && design"
        :screens="design.index.screens"
        :index="lightboxIndex ?? 0"
        @close="closeLightbox"
        @index="lightboxIndex = $event"
      />
    </ClientOnly>
  </div>
</template>
