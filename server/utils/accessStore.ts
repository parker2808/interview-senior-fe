import { MemoryAccessStore } from '@/modules/access/utils/memory-access-store'
import type { AccessStore } from '@/modules/access/utils/access-store.interface'
import { createRedisAccessStore } from './accessRedisStore'

let store: AccessStore | null = null

export function getAccessStore(): AccessStore {
  if (store) return store
  store = createRedisAccessStore() ?? new MemoryAccessStore(false)
  return store
}

export function setAccessStoreForTests(next: AccessStore | null) {
  store = next
}

export function accessStorageConfigured() {
  return getAccessStore().configured
}
