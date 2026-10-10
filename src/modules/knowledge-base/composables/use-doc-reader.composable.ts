import type { KnowledgeDocResponse } from '@/modules/content/types'
import { tocFromSections } from '@/modules/content/utils/block-toc.util'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'
import { useKbCatalog } from '@/modules/knowledge-base/composables/use-kb-catalog.composable'
import {
  pushRecentDoc,
  readRecentDocs,
} from '@/modules/knowledge-base/utils/recent-docs.util'
import type { DocLang } from '@/modules/core/constants/locale.constant'
import { DOC_LANGS } from '@/modules/core/constants/locale.constant'

export function useDocReader(lang: Ref<string>, slug: Ref<string>) {
  const recent = ref(readRecentDocs())
  const catalogAsync = useKbCatalog()

  const safeLang = computed<DocLang>(() =>
    DOC_LANGS.includes(lang.value as DocLang)
      ? (lang.value as DocLang)
      : 'vi',
  )

  const docAsync = useAsyncData(
    () => `kb-doc-${slug.value}`,
    () => $fetch<KnowledgeDocResponse>(`/api/knowledge-base/docs/${slug.value}`),
    { watch: [slug] },
  )

  const topic = computed(() =>
    catalogAsync.data.value?.docs.find((item) => item.slug === slug.value),
  )

  const toc = computed(() =>
    tocFromSections(docAsync.data.value?.sections, safeLang.value),
  )

  const adjacent = computed(
    () => docAsync.data.value?.adjacent ?? { prev: null, next: null },
  )

  const title = computed(() => {
    if (docAsync.data.value) return pickLocale(docAsync.data.value.title, safeLang.value)
    if (topic.value) return pickLocale(topic.value.title, safeLang.value)
    return slug.value
  })

  const pending = computed(
    () => Boolean(docAsync.pending.value || catalogAsync.pending.value),
  )
  const error = computed(() => docAsync.error.value || catalogAsync.error.value)

  async function refresh() {
    await Promise.all([docAsync.refresh(), catalogAsync.refresh()])
  }

  watch(
    [safeLang, slug],
    ([l, s]) => {
      if (!topic.value && !docAsync.data.value) return
      pushRecentDoc(s, l)
      recent.value = readRecentDocs()
    },
    { immediate: true },
  )

  return {
    catalog: computed(() => catalogAsync.data.value?.groups ?? []),
    catalogPending: computed(() => Boolean(catalogAsync.pending.value)),
    catalogError: computed(() => catalogAsync.error.value),
    flatTopics: computed(() => catalogAsync.data.value?.docs ?? []),
    defaultSlug: computed(
      () => catalogAsync.data.value?.defaultSlug ?? 'javascript',
    ),
    safeLang,
    topic,
    pending,
    error,
    doc: docAsync.data,
    toc,
    adjacent,
    title,
    recent,
    refresh,
  }
}
