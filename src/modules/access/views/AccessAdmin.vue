<script setup lang="ts">
import AppTopBar from '@/modules/core/components/AppTopBar/AppTopBar.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'
import AccessMembers from '@/modules/access/components/AccessMembers/AccessMembers.vue'
import AccessShares from '@/modules/access/components/AccessShares/AccessShares.vue'
import AccessActivity from '@/modules/access/components/AccessActivity/AccessActivity.vue'
import { fetchAccessMeta } from '@/modules/access/services/access-admin.service'

type Tab = 'members' | 'shares' | 'activity'

const tab = ref<Tab>('members')
const storageConfigured = ref(false)
const envOwners = ref<string[]>([])
const loading = ref(true)
const error = ref('')
const activityRef = ref<{ reload: () => Promise<void> } | null>(null)

const tabs: { id: Tab; key: string }[] = [
  { id: 'members', key: 'access.tabMembers' },
  { id: 'shares', key: 'access.tabShares' },
  { id: 'activity', key: 'access.tabActivity' },
]

async function loadMeta() {
  loading.value = true
  error.value = ''
  try {
    const meta = await fetchAccessMeta()
    storageConfigured.value = meta.storageConfigured
    envOwners.value = meta.envOwners
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load'
  } finally {
    loading.value = false
  }
}

function onChanged() {
  if (tab.value === 'activity') {
    void activityRef.value?.reload()
  }
}

onMounted(() => {
  void loadMeta()
})
</script>

<template>
  <div class="mx-auto min-h-screen max-w-hub pb-12">
    <AppTopBar :title="$t('access.title')" :home-label="$t('access.backHub')">
      <template #actions>
        <LocaleToggle />
        <ThemeToggle />
      </template>
    </AppTopBar>

    <div class="px-4 pt-6 sm:px-6 lg:px-8">
      <header class="max-w-3xl">
        <p class="text-sm font-semibold uppercase tracking-[0.14em] text-accent-ink">
          {{ $t('access.eyebrow') }}
        </p>
        <h1 class="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {{ $t('access.headline') }}
        </h1>
        <p class="mt-3 text-sm text-ink-muted sm:text-base">
          {{ $t('access.sub') }}
        </p>
      </header>

      <div
        v-if="!loading && !storageConfigured"
        class="mt-5 rounded-2xl border border-line bg-accent-soft px-4 py-3 text-sm text-ink"
        role="status"
      >
        {{ $t('access.storageMissing') }}
      </div>

      <p
        v-if="envOwners.length"
        class="mt-3 text-xs text-ink-faint"
      >
        {{ $t('access.envOwners', { logins: envOwners.join(', ') }) }}
      </p>

      <p v-if="error" class="mt-3 text-sm text-red-700" role="alert">
        {{ error }}
      </p>

      <div
        class="mt-6 flex gap-2 overflow-x-auto"
        role="tablist"
        :aria-label="$t('access.title')"
      >
        <button
          v-for="item in tabs"
          :key="item.id"
          type="button"
          role="tab"
          class="min-h-11 shrink-0 rounded-lg px-4 text-sm font-semibold"
          :class="
            tab === item.id
              ? 'bg-accent text-white'
              : 'border border-line bg-surface-elevated text-ink'
          "
          :aria-selected="tab === item.id"
          @click="tab = item.id"
        >
          {{ $t(item.key) }}
        </button>
      </div>

      <div class="mt-6">
        <AccessMembers
          v-if="tab === 'members'"
          :storage-configured="storageConfigured"
          @changed="onChanged"
        />
        <AccessShares
          v-else-if="tab === 'shares'"
          :storage-configured="storageConfigured"
          @changed="onChanged"
        />
        <AccessActivity v-else ref="activityRef" />
      </div>
    </div>
  </div>
</template>
