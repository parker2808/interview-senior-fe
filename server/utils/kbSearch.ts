import type { KnowledgeDoc } from '@/modules/content/types'
import type { DocLang } from '@/modules/core/constants/locale.constant'
import {
  indexKnowledgeDoc,
  searchIndexRecords,
  type KbSearchHit,
} from '@/modules/knowledge-base/utils/kb-search-core.util'
import { readKnowledgeCatalog, readKnowledgeDoc } from './contentStore'

type SearchRecord = ReturnType<typeof indexKnowledgeDoc>[number]

let indexPromise: Promise<SearchRecord[]> | null = null

async function buildSearchIndex(): Promise<SearchRecord[]> {
  const catalog = await readKnowledgeCatalog()
  const docs = await Promise.all(
    catalog.docs.map((item) =>
      readKnowledgeDoc(item.slug).catch(() => null),
    ),
  )
  const records: SearchRecord[] = []
  for (const doc of docs) {
    if (!doc) continue
    records.push(...indexKnowledgeDoc(doc as KnowledgeDoc, 'vi'))
    records.push(...indexKnowledgeDoc(doc as KnowledgeDoc, 'en'))
  }
  return records
}

export async function getKbSearchIndex(): Promise<SearchRecord[]> {
  if (!indexPromise) indexPromise = buildSearchIndex()
  return indexPromise
}

export async function searchKnowledgeBase(
  query: string,
  lang: DocLang,
  limit = 20,
): Promise<KbSearchHit[]> {
  const index = await getKbSearchIndex()
  return searchIndexRecords(index, query, lang, limit)
}
