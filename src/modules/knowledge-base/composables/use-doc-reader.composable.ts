import { marked } from 'marked'
import {
  DEFAULT_DOC_SLUG,
  DOC_CATALOG,
  FLAT_TOPICS,
  getAdjacentTopics,
  getTopic,
} from '@/modules/knowledge-base/constants/doc-catalog.constant'
import {
  kbPath,
  loadKbMarkdown,
} from '@/modules/knowledge-base/utils/load-kb-markdown.util'
import { enhanceMarkdownHtml } from '@/modules/knowledge-base/utils/toc.util'
import {
  pushRecentDoc,
  readRecentDocs,
} from '@/modules/knowledge-base/utils/recent-docs.util'
import type { DocLang } from '@/modules/core/constants/locale.constant'
import { DOC_LANGS } from '@/modules/core/constants/locale.constant'

export function useDocReader(lang: Ref<string>, slug: Ref<string>) {
  const recent = ref(readRecentDocs())

  const safeLang = computed<DocLang>(() =>
    DOC_LANGS.includes(lang.value as DocLang)
      ? (lang.value as DocLang)
      : 'vi',
  )

  const topic = computed(() => getTopic(slug.value))
  const path = computed(() => kbPath(safeLang.value, slug.value))
  const loaded = computed(() => loadKbMarkdown(path.value))

  const rendered = computed(() => {
    const rawHtml = marked.parse(loaded.value.text, { async: false }) as string
    return enhanceMarkdownHtml(rawHtml)
  })

  const adjacent = computed(() => getAdjacentTopics(slug.value))

  const title = computed(() => {
    if (!topic.value) return slug.value
    return topic.value.title[safeLang.value] || topic.value.title.vi
  })

  watch(
    [safeLang, slug],
    ([l, s]) => {
      if (!getTopic(s)) return
      pushRecentDoc(s, l)
      recent.value = readRecentDocs()
    },
    { immediate: true },
  )

  return {
    catalog: DOC_CATALOG,
    flatTopics: FLAT_TOPICS,
    defaultSlug: DEFAULT_DOC_SLUG,
    safeLang,
    topic,
    path,
    loaded,
    html: computed(() => rendered.value.html),
    toc: computed(() => rendered.value.toc),
    adjacent,
    title,
    recent,
  }
}
