<script setup lang="ts">
import ConfirmDialog from '@/modules/access/components/ConfirmDialog/ConfirmDialog.vue'
import AccessSkeleton from '@/modules/access/components/AccessSkeleton/AccessSkeleton.vue'
import type { SharePreset, ShareScope } from '@/modules/access/types/entities/access.type'
import type { CreatedShare, ShareRow } from '@/modules/access/services/access-admin.service'
import {
  createShare,
  extendShare,
  fetchShares,
  revokeShare,
} from '@/modules/access/services/access-admin.service'
import {
  describeScope,
  formatAccessDate,
} from '@/modules/access/utils/format-access.util'

const props = defineProps<{
  storageConfigured: boolean
}>()

const emit = defineEmits<{
  changed: []
}>()

const { locale, t } = useI18n()
const shares = ref<ShareRow[]>([])
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const label = ref('')
const scopeType = ref<ShareScope['type']>('qa-all')
const categoryIds = ref<string[]>(['technical'])
const questionIds = ref('')
const preset = ref<SharePreset | 'custom'>('7d')
const customExpiry = ref('')
const maxUses = ref('')
const created = ref<CreatedShare | null>(null)
const copied = ref(false)
const pendingRevoke = ref<ShareRow | null>(null)
const removing = ref(false)

const categories = [
  { id: 'soft', key: 'access.catSoft' },
  { id: 'technical', key: 'access.catTechnical' },
  { id: 'situational', key: 'access.catSituational' },
] as const

function toggleCategory(id: string) {
  const next = new Set(categoryIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  categoryIds.value = [...next]
}

function buildScope(): ShareScope | null {
  if (scopeType.value === 'qa-all') return { type: 'qa-all' }
  if (scopeType.value === 'qa-categories') {
    if (!categoryIds.value.length) return null
    return { type: 'qa-categories', categoryIds: [...categoryIds.value] }
  }
  const ids = questionIds.value
    .split(/[\s,]+/)
    .map((id) => id.trim())
    .filter(Boolean)
  if (!ids.length) return null
  return { type: 'qa-questions', questionIds: ids }
}

async function reload() {
  loading.value = true
  error.value = ''
  try {
    const data = await fetchShares()
    shares.value = data.shares
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('auth.genericError')
  } finally {
    loading.value = false
  }
}

async function onCreate() {
  if (!props.storageConfigured || saving.value) return
  const scope = buildScope()
  if (!scope) {
    error.value = t('access.badScope')
    return
  }
  saving.value = true
  error.value = ''
  copied.value = false
  try {
    created.value = await createShare({
      label: label.value,
      scope,
      preset: preset.value,
      expiresAt: preset.value === 'custom' ? customExpiry.value : undefined,
      maxUses: maxUses.value ? Number(maxUses.value) : null,
    })
    label.value = ''
    questionIds.value = ''
    maxUses.value = ''
    await reload()
    emit('changed')
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('auth.genericError')
  } finally {
    saving.value = false
  }
}

async function copyCreated() {
  if (!created.value?.url) return
  try {
    await navigator.clipboard.writeText(created.value.url)
    copied.value = true
  } catch {
    copied.value = false
  }
}

async function onExtend(row: ShareRow, next: string) {
  if (next !== '1h' && next !== '1d' && next !== '7d' && next !== '30d') return
  error.value = ''
  try {
    await extendShare(row.id, { preset: next })
    await reload()
    emit('changed')
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('auth.genericError')
  }
}

async function confirmRevoke() {
  const row = pendingRevoke.value
  if (!row) return
  removing.value = true
  error.value = ''
  try {
    await revokeShare(row.id)
    pendingRevoke.value = null
    await reload()
    emit('changed')
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('auth.genericError')
  } finally {
    removing.value = false
  }
}

function statusLabel(status: ShareRow['status']) {
  if (status === 'ok') return t('access.statusOk')
  if (status === 'revoked') return t('access.statusRevoked')
  if (status === 'max_uses') return t('access.statusMaxUses')
  return t('access.statusExpired')
}

onMounted(() => {
  void reload()
})
</script>

<template>
  <div>
    <form
      class="rounded-2xl border border-line bg-surface-elevated p-4 sm:p-5"
      @submit.prevent="onCreate"
    >
      <h2 class="text-base font-bold text-ink">
        {{ $t('access.createLink') }}
      </h2>
      <fieldset
        class="mt-4 space-y-3"
        :disabled="!storageConfigured || saving"
      >
        <label class="block text-sm font-semibold text-ink">
          {{ $t('access.label') }}
          <input
            v-model="label"
            maxlength="80"
            class="mt-1 min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm font-normal outline-none focus:border-accent"
            :placeholder="$t('access.labelPlaceholder')"
          />
        </label>

        <div>
          <p class="text-sm font-semibold text-ink">{{ $t('access.scope') }}</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <label
              v-for="option in [
                ['qa-all', 'access.scopeAll'],
                ['qa-categories', 'access.scopeCategories'],
                ['qa-questions', 'access.scopeQuestions'],
              ] as const"
              :key="option[0]"
              class="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm"
            >
              <input v-model="scopeType" type="radio" :value="option[0]" />
              {{ $t(option[1]) }}
            </label>
          </div>
          <div
            v-if="scopeType === 'qa-categories'"
            class="mt-2 flex flex-wrap gap-2"
          >
            <label
              v-for="cat in categories"
              :key="cat.id"
              class="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm"
            >
              <input
                type="checkbox"
                :checked="categoryIds.includes(cat.id)"
                @change="toggleCategory(cat.id)"
              />
              {{ $t(cat.key) }}
            </label>
          </div>
          <label v-if="scopeType === 'qa-questions'" class="mt-2 block text-sm">
            <textarea
              v-model="questionIds"
              rows="3"
              class="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
              :placeholder="$t('access.questionIdsPlaceholder')"
            />
          </label>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label class="block text-sm font-semibold text-ink">
            {{ $t('access.expiry') }}
            <select
              v-model="preset"
              class="mt-1 min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm font-normal outline-none focus:border-accent"
            >
              <option value="1h">{{ $t('access.preset1h') }}</option>
              <option value="1d">{{ $t('access.preset1d') }}</option>
              <option value="7d">{{ $t('access.preset7d') }}</option>
              <option value="30d">{{ $t('access.preset30d') }}</option>
              <option value="custom">{{ $t('access.presetCustom') }}</option>
            </select>
          </label>
          <label
            v-if="preset === 'custom'"
            class="block text-sm font-semibold text-ink"
          >
            {{ $t('access.customExpiry') }}
            <input
              v-model="customExpiry"
              type="datetime-local"
              required
              class="mt-1 min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm font-normal outline-none focus:border-accent"
            />
          </label>
          <label class="block text-sm font-semibold text-ink">
            {{ $t('access.maxUses') }}
            <input
              v-model="maxUses"
              type="number"
              min="1"
              max="10000"
              class="mt-1 min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm font-normal outline-none focus:border-accent"
              :placeholder="$t('access.maxUsesOptional')"
            />
          </label>
        </div>
      </fieldset>
      <button
        type="submit"
        class="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-white disabled:opacity-50"
        :disabled="!storageConfigured || saving"
      >
        {{ saving ? $t('access.saving') : $t('access.create') }}
      </button>
    </form>

    <div
      v-if="created"
      class="mt-4 rounded-2xl border border-accent bg-accent-soft p-4"
    >
      <p class="text-sm font-semibold text-ink">{{ $t('access.tokenOnce') }}</p>
      <p class="mt-2 break-all font-mono text-xs text-ink">{{ created.url }}</p>
      <button
        type="button"
        class="mt-3 inline-flex min-h-10 items-center rounded-lg bg-accent px-3 text-sm font-semibold text-white"
        @click="copyCreated"
      >
        {{ copied ? $t('access.copied') : $t('access.copyLink') }}
      </button>
    </div>

    <p v-if="error" class="mt-3 text-sm text-red-700" role="alert">
      {{ error }}
    </p>

    <AccessSkeleton v-if="loading" class="mt-4" />

    <ul v-else class="mt-4 space-y-3">
      <li
        v-for="row in shares"
        :key="row.id"
        class="rounded-2xl border border-line bg-surface-elevated p-4"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="font-semibold text-ink">
              {{ row.label || $t('access.untitledLink') }}
            </p>
            <p class="mt-1 text-xs text-ink-muted">
              {{ $t('access.scope') }}:
              {{
                row.scope.type === 'qa-all'
                  ? $t('access.scopeAll')
                  : describeScope(row.scope)
              }}
            </p>
            <p class="mt-1 text-xs text-ink-muted">
              {{ $t('access.created') }}
              {{ formatAccessDate(row.createdAt, locale) }}
              ·
              {{ $t('access.expires') }}
              {{ formatAccessDate(row.expiresAt, locale) }}
            </p>
            <p class="mt-1 text-xs text-ink-muted">
              {{ $t('access.uses') }}:
              {{ row.useCount }}{{ row.maxUses ? ` / ${row.maxUses}` : '' }}
              ·
              {{ $t('access.lastUsed') }}:
              {{ formatAccessDate(row.lastUsedAt, locale) }}
            </p>
          </div>
          <span
            class="rounded-md px-2 py-1 text-xs font-semibold"
            :class="
              row.status === 'ok'
                ? 'bg-done-soft text-done'
                : 'border border-line text-ink-muted'
            "
          >
            {{ statusLabel(row.status) }}
          </span>
        </div>
        <div v-if="row.status === 'ok'" class="mt-3 flex flex-wrap gap-2">
          <label class="inline-flex items-center gap-2 text-sm">
            {{ $t('access.extend') }}
            <select
              class="min-h-10 rounded-lg border border-line bg-surface px-2 text-sm"
              @change="
                onExtend(row, ($event.target as HTMLSelectElement).value)
              "
            >
              <option value="">{{ $t('access.choosePreset') }}</option>
              <option value="1h">{{ $t('access.preset1h') }}</option>
              <option value="1d">{{ $t('access.preset1d') }}</option>
              <option value="7d">{{ $t('access.preset7d') }}</option>
              <option value="30d">{{ $t('access.preset30d') }}</option>
            </select>
          </label>
          <button
            type="button"
            class="min-h-10 rounded-lg border border-line px-3 text-sm font-semibold text-red-700"
            @click="pendingRevoke = row"
          >
            {{ $t('access.revoke') }}
          </button>
        </div>
      </li>
      <li
        v-if="!shares.length"
        class="rounded-2xl border border-dashed border-line px-4 py-8 text-center text-sm text-ink-muted"
      >
        {{ $t('access.emptyShares') }}
      </li>
    </ul>

    <ConfirmDialog
      :open="Boolean(pendingRevoke)"
      :title="$t('access.revokeTitle')"
      :message="$t('access.revokeHint')"
      :busy="removing"
      @cancel="pendingRevoke = null"
      @confirm="confirmRevoke"
    />
  </div>
</template>
