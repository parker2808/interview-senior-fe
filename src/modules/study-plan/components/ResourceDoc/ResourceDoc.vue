<script setup lang="ts">
import BlockRenderer from '@/modules/content/components/BlockRenderer/BlockRenderer.vue'
import { classifyContentHref } from '@/modules/content/utils/content-links.util'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'
import {
  usePlanIndex,
  usePlanResource,
} from '@/modules/study-plan/composables/use-plan-index.composable'
import ContentSkeleton from '@/modules/content/components/ContentSkeleton/ContentSkeleton.vue'
import ContentStatus from '@/modules/content/components/ContentStatus/ContentStatus.vue'

const props = defineProps<{
  path: string
}>()

const emit = defineEmits<{
  'open-doc': [path: string]
  'open-docs': [payload: { lang: string; slug: string; hash?: string }]
}>()

const { locale, t } = useI18n()
const lang = computed<'en' | 'vi'>(() =>
  locale.value === 'en' ? 'en' : 'vi',
)
const resourceId = computed(() => props.path)
const {
  data: resource,
  pending,
  error,
  refresh,
} = await usePlanResource(resourceId)

const retrying = ref(false)
async function retry() {
  retrying.value = true
  try {
    await refresh()
  } finally {
    retrying.value = false
  }
}
const { data: plan } = usePlanIndex()

const aliases = computed(() =>
  (plan.value?.resources ?? []).flatMap((item) => [item.id, ...item.aliases]),
)

function onDocClick(e: MouseEvent) {
  const a = (e.target as HTMLElement).closest('a')
  if (!a) return
  const href = a.getAttribute('href')
  const result = classifyContentHref(
    href || '',
    resource.value?.id || props.path,
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
    <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-accent-ink">
      {{ t('plan.resourceDoc') }}
    </p>
    <h2 class="mb-4 break-all text-lg font-bold sm:text-xl">
      {{ resource ? pickLocale(resource.title, lang) : path }}
    </h2>
    <BlockRenderer
      v-if="resource"
      :sections="resource.sections"
      :lang="lang"
      @click="onDocClick"
    />
    <ContentSkeleton v-else-if="pending" variant="plan-resource" />
    <ContentStatus
      v-else-if="error"
      kind="error"
      :message="t('plan.loadError')"
      :retrying="retrying"
      @retry="retry"
    />
    <ContentStatus
      v-else
      kind="empty"
      :message="t('plan.dayNotFound')"
    />
  </article>
</template>
