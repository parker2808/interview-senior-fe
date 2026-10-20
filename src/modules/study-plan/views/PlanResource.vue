<script setup lang="ts">
import AppTopBar from '@/modules/core/components/AppTopBar/AppTopBar.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'
import AppDetailShell from '@/modules/core/components/AppDetailShell/AppDetailShell.vue'
import ResourceDoc from '@/modules/study-plan/components/ResourceDoc/ResourceDoc.vue'
import {
  docsHref,
  openInNewTab,
} from '@/modules/study-plan/utils/open-app-link.util'
import {
  planResourceHref,
  usePlanIndex,
} from '@/modules/study-plan/composables/use-plan-index.composable'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'

const props = defineProps<{
  path: string
}>()

const router = useRouter()
const { locale, t } = useI18n()
const lang = computed<'en' | 'vi'>(() => (locale.value === 'en' ? 'en' : 'vi'))
const navOpen = ref(false)
const { data: plan } = await usePlanIndex()

function openDoc(path: string) {
  if (path.startsWith('documents/')) {
    const m = path.match(/^documents\/(vi|en)\/([^/]+)\.md$/)
    if (m) {
      openInNewTab(docsHref(m[1], m[2]))
      return
    }
  }
  router.push(planResourceHref(path))
}

function openDocs(payload: { lang: string; slug: string; hash?: string }) {
  openInNewTab(docsHref(payload.lang, payload.slug, payload.hash))
}

function goResource(id: string) {
  navOpen.value = false
  router.push(planResourceHref(id))
}
</script>

<template>
  <AppDetailShell v-model:nav-open="navOpen">
    <template #topbar="{ onHeightChange, scrollTarget }">
      <AppTopBar
        :title="t('plan.title')"
        :home-label="t('plan.backHub')"
        back-to="/plan"
        :back-label="t('plan.backPlan')"
        inner-class="px-2 sm:px-4 lg:px-5"
        :scroll-target="scrollTarget"
        :lock-visible="true"
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
          <LocaleToggle />
          <ThemeToggle />
        </template>
      </AppTopBar>
    </template>

    <template #nav>
      <nav class="flex min-w-0 flex-col gap-2 p-4" :aria-label="t('plan.resources.plan')">
        <button
          v-for="item in plan?.resources ?? []"
          :key="item.id"
          type="button"
          class="flex min-h-10 min-w-0 w-full items-center rounded-lg border-l-2 px-2.5 text-left text-sm transition"
          :class="
            item.id === path || item.aliases.includes(path)
              ? 'border-accent bg-accent-soft font-semibold text-accent-ink'
              : 'border-transparent text-ink-muted hover:bg-white hover:text-ink'
          "
          @click="goResource(item.id)"
        >
          <span class="min-w-0 truncate">{{ pickLocale(item.title, lang) }}</span>
        </button>
      </nav>
    </template>

    <ResourceDoc
      :path="path"
      @open-doc="openDoc"
      @open-docs="openDocs"
    />
  </AppDetailShell>
</template>
