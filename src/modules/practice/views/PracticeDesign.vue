<script setup lang="ts">
import AppTopBar from '@/modules/core/components/AppTopBar/AppTopBar.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'
import AppDetailShell from '@/modules/core/components/AppDetailShell/AppDetailShell.vue'
import PracticeSubnav from '@/modules/practice/components/PracticeSubnav/PracticeSubnav.vue'
import DesignGallery from '@/modules/practice/components/DesignGallery/DesignGallery.vue'
import DesignLightbox from '@/modules/practice/components/DesignLightbox/DesignLightbox.vue'
import DesignSpec from '@/modules/practice/components/DesignSpec/DesignSpec.vue'
import DocToc from '@/modules/knowledge-base/components/DocToc/DocToc.vue'
import {
  usePracticeDesign,
  usePracticeDesignAvailable,
} from '@/modules/practice/composables/use-practice-index.composable'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'
import { practiceDesignFigma } from '@/modules/practice/utils/design-figma.util'
import { pickSpecMarkdown } from '@/modules/practice/utils/spec-locale.util'
import ContentSkeleton from '@/modules/content/components/ContentSkeleton/ContentSkeleton.vue'
import ContentStatus from '@/modules/content/components/ContentStatus/ContentStatus.vue'
import type { TocItem } from '@/modules/content/types'

const route = useRoute()
const router = useRouter()
const { locale, t } = useI18n()
const lang = computed<'en' | 'vi'>(() => (locale.value === 'en' ? 'en' : 'vi'))

const { data: design, pending, error, refresh } = await usePracticeDesign()
const { data: designAvailable } = await usePracticeDesignAvailable()

const retrying = ref(false)
const navOpen = ref(false)
const shellRef = ref<{ mainRef: HTMLElement | null } | null>(null)
const specRef = ref<{ jumpTo: (id: string) => void; activeHeading: string } | null>(null)

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

const figma = computed(() => practiceDesignFigma(design.value?.index.figma))

const specPick = computed(() =>
  pickSpecMarkdown(
    {
      en: design.value?.specMarkdown,
      vi: design.value?.specMarkdownVi,
    },
    lang.value,
  ),
)

const specHeadings = computed<TocItem[]>(() => {
  if (specPick.value.usedLocale === 'vi' && design.value?.headingsVi?.length) {
    return design.value.headingsVi
  }
  return design.value?.headings ?? []
})

const tabClass = (on: boolean) =>
  on
    ? 'border-accent bg-accent-soft text-accent-ink'
    : 'border-line bg-surface-elevated text-ink hover:border-accent hover:text-accent-ink'

function jumpSpec(id: string) {
  specRef.value?.jumpTo(id)
  navOpen.value = false
}
</script>

<template>
  <AppDetailShell ref="shellRef" v-model:nav-open="navOpen">
    <template #topbar="{ onHeightChange, scrollTarget }">
      <AppTopBar
        :title="
          design ? pickLocale(design.index.title, lang) : t('practice.designTitle')
        "
        :home-label="t('practice.backHub')"
        back-to="/practice"
        :back-label="t('practice.backList')"
        inner-class="px-2 sm:px-4 lg:px-5"
        :scroll-target="scrollTarget"
        :lock-visible="navOpen"
        @heightchange="onHeightChange"
      >
        <template #leading>
          <button
            type="button"
            class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-ink lg:hidden"
            :aria-label="$t('docs.openNav')"
            @click="navOpen = true"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </template>
        <template #actions>
          <a
            href="/docs"
            target="_blank"
            rel="noopener"
            class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-elevated text-ink transition hover:border-accent hover:text-accent-ink"
            :aria-label="t('practice.openDocs')"
            :title="t('practice.openDocs')"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </a>
          <LocaleToggle />
          <ThemeToggle />
        </template>
      </AppTopBar>
    </template>

    <template #nav>
      <div class="p-3">
        <PracticeSubnav
          v-if="designAvailable !== false"
          active="design"
          :design-available="true"
        />
      </div>
      <DocToc
        v-if="tab === 'spec'"
        :items="specHeadings"
        :active-id="specRef?.activeHeading || ''"
        @navigate="jumpSpec"
      />
      <p v-else class="p-4 text-sm text-ink-muted">
        {{ t('practice.tabScreens') }}
      </p>
    </template>

    <ContentSkeleton
      v-if="pending && !design"
      variant="practice-design"
    />
    <ContentStatus
      v-else-if="error && !notFound"
      kind="error"
      :message="t('practice.loadError')"
      :retrying="retrying"
      @retry="retry"
    />
    <ContentStatus
      v-else-if="!design"
      kind="empty"
      :message="t('practice.emptyDesign')"
    />
    <div v-else class="animate-fade-up pb-10">
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
        <div v-if="figma" class="mt-4 max-w-3xl">
          <a
            :href="figma.url"
            target="_blank"
            rel="noopener"
            class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-surface-elevated px-3 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent-ink"
          >
            {{ pickLocale(figma.label, lang) }}
            <span class="text-ink-faint" aria-hidden="true">↗</span>
          </a>
          <p class="mt-2 text-xs leading-5 text-ink-muted">
            {{ pickLocale(figma.note, lang) }}
          </p>
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

      <section class="mt-6">
        <DesignGallery
          v-if="tab === 'screens'"
          :screens="design.index.screens"
          :headings="specHeadings"
          @open="openLightbox"
        />
        <DesignSpec
          v-else
          ref="specRef"
          :markdown="specPick.markdown"
          :headings="specHeadings"
          hide-toc
          :scroll-root="shellRef?.mainRef ?? null"
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
  </AppDetailShell>
</template>
