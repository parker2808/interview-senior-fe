<script setup lang="ts">
import AccessSkeleton from '@/modules/access/components/AccessSkeleton/AccessSkeleton.vue'
import type { AuditEntry } from '@/modules/access/types/entities/access.type'
import { fetchAudit } from '@/modules/access/services/access-admin.service'
import { formatAccessDate } from '@/modules/access/utils/format-access.util'

const { locale, t } = useI18n()
const entries = ref<AuditEntry[]>([])
const loading = ref(true)
const error = ref('')

async function reload() {
  loading.value = true
  error.value = ''
  try {
    const data = await fetchAudit()
    entries.value = data.entries
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('auth.genericError')
  } finally {
    loading.value = false
  }
}

function actionLabel(action: AuditEntry['action']) {
  return t(`access.audit.${action}`)
}

function detailText(entry: AuditEntry) {
  const login = typeof entry.detail.login === 'string' ? entry.detail.login : ''
  const role = typeof entry.detail.role === 'string' ? entry.detail.role : ''
  const label = typeof entry.detail.label === 'string' ? entry.detail.label : ''
  return [login, role, label].filter(Boolean).join(' · ')
}

onMounted(() => {
  void reload()
})

defineExpose({ reload })
</script>

<template>
  <div>
    <p v-if="error" class="mb-3 text-sm text-red-700" role="alert">
      {{ error }}
    </p>
    <AccessSkeleton v-if="loading" />
    <ol v-else class="space-y-3">
      <li
        v-for="entry in entries"
        :key="entry.id"
        class="rounded-2xl border border-line bg-surface-elevated p-4"
      >
        <p class="text-sm font-semibold text-ink">
          {{ actionLabel(entry.action) }}
        </p>
        <p class="mt-1 text-xs text-ink-muted">
          @{{ entry.actor.login }}
          ·
          {{ formatAccessDate(entry.at, locale) }}
        </p>
        <p v-if="detailText(entry)" class="mt-1 text-xs text-ink-faint">
          {{ detailText(entry) }}
        </p>
      </li>
      <li
        v-if="!entries.length"
        class="rounded-2xl border border-dashed border-line px-4 py-8 text-center text-sm text-ink-muted"
      >
        {{ $t('access.emptyAudit') }}
      </li>
    </ol>
  </div>
</template>
