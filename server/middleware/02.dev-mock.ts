import { MemoryAccessStore } from '@/modules/access/utils/memory-access-store'
import type { ShareLink, StoredMember } from '@/modules/access/types/entities/access.type'
import { setAccessStoreForTests } from '../utils/accessStore'

let seeded = false

function seedMockStore() {
  if (seeded) return
  const store = new MemoryAccessStore(true)
  const now = Date.now()
  const actor = { login: 'parker2808', id: 38419968 }
  const viewer: StoredMember = {
    id: 1,
    login: 'octocat',
    role: 'viewer',
    note: 'Demo viewer',
    expiresAt: now + 14 * 24 * 60 * 60 * 1000,
    addedAt: now - 86400000,
    addedBy: actor,
    sessionVersion: 0,
  }
  const extraOwner: StoredMember = {
    id: 2,
    login: 'hubot',
    role: 'owner',
    note: '',
    expiresAt: null,
    addedAt: now - 3600000,
    addedBy: actor,
    sessionVersion: 0,
  }
  const share: ShareLink = {
    id: 'share-demo',
    tokenHash: 'demo-hash',
    label: 'Frontend drill',
    scope: { type: 'qa-categories', categoryIds: ['technical'] },
    createdAt: now - 120000,
    createdBy: actor,
    expiresAt: now + 7 * 24 * 60 * 60 * 1000,
    maxUses: 20,
    useCount: 3,
    lastUsedAt: now - 60000,
    revokedAt: null,
  }
  void store.upsertMember(viewer)
  void store.upsertMember(extraOwner)
  void store.putShare(share)
  void store.appendAudit({
    id: 'a1',
    at: now - 60000,
    actor,
    action: 'share.create',
    detail: { label: 'Frontend drill' },
  })
  void store.appendAudit({
    id: 'a2',
    at: now - 3600000,
    actor,
    action: 'member.add',
    detail: { login: 'octocat', role: 'viewer' },
  })
  setAccessStoreForTests(store)
  seeded = true
}

export default defineEventHandler(async (event) => {
  if (!import.meta.dev) return
  const mode = process.env.AUTH_DEV_MOCK
  if (!mode) return
  seedMockStore()

  if (mode === 'owner') {
    await replaceUserSession(event, {
      user: {
        login: 'parker2808',
        id: 38419968,
        name: 'Parker',
        avatarUrl: 'https://avatars.githubusercontent.com/u/38419968?v=4',
        role: 'owner',
        sessionVersion: 0,
      },
      loggedInAt: Date.now(),
    })
    return
  }

  if (mode === 'viewer') {
    await replaceUserSession(event, {
      user: {
        login: 'octocat',
        id: 1,
        name: 'Octocat',
        avatarUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        role: 'viewer',
        sessionVersion: 0,
      },
      loggedInAt: Date.now(),
    })
    return
  }

  if (mode === 'share') {
    await replaceUserSession(event, {
      share: {
        id: 'share-demo',
        label: 'Frontend drill',
        scope: { type: 'qa-categories', categoryIds: ['technical'] },
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      },
    })
  }
})
