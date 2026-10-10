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
  const { data: catalog } = useKbCatalog()

  const safeLang = computed<DocLang>(() =>
    DOC_LANGS.includes(lang.value as DocLang)
      ? (lang.value as DocLang)
      : 'vi',
  )

  const { data: doc, pending, error } = useAsyncData(
    () => `kb-doc-${slug.value}`,
    () => $fetch<KnowledgeDocResponse>(`/api/knowledge-base/docs/${slug.value}`),
    { watch: [slug] },
  )

  const topic = computed(() =>
    catalog.value?.docs.find((item) => item.slug === slug.value),
  )

  const toc = computed(() =>
    tocFromSections(doc.value?.sections, safeLang.value),
  )

  const adjacent = computed(
    () => doc.value?.adjacent ?? { prev: null, next: null },
  )

  const title = computed(() => {
    if (doc.value) return pickLocale(doc.value.title, safeLang.value)
    if (topic.value) return pickLocale(topic.value.title, safeLang.value)
    return slug.value
  })

  const loaded = computed(() => ({
    ok: Boolean(doc.value && !error.value),
    path: slug.value,
    text: '',
  }))

  watch(
    [safeLang, slug],
    ([l, s]) => {
      if (!topic.value && !doc.value) return
      pushRecentDoc(s, l)
      recent.value = readRecentDocs()
    },
    { immediate: true },
  )

  return {
    catalog: computed(() => catalog.value?.groups ?? []),
    flatTopics: computed(() => catalog.value?.docs ?? []),
    defaultSlug: computed(
      () => catalog.value?.defaultSlug ?? 'javascript',
    ),
    safeLang,
    topic,
    loaded,
    pending,
    doc,
    toc,
    adjacent,
    title,
    recent,
  }
}
