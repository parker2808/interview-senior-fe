<script setup lang="ts">
import ConfirmDialog from '@/modules/access/components/ConfirmDialog/ConfirmDialog.vue'
import AccessSkeleton from '@/modules/access/components/AccessSkeleton/AccessSkeleton.vue'
import type { AccessRole } from '@/modules/access/types/entities/access.type'
import type { MemberRow } from '@/modules/access/services/access-admin.service'
import {
  addMember,
  fetchMembers,
  patchMember,
  removeMember,
} from '@/modules/access/services/access-admin.service'
import { formatAccessDate } from '@/modules/access/utils/format-access.util'

const props = defineProps<{
  storageConfigured: boolean
}>()

const emit = defineEmits<{
  changed: []
}>()

const { locale, t } = useI18n()
const members = ref<MemberRow[]>([])
const loading = ref(true)
const error = ref('')
const query = ref('')
const login = ref('')
const role = ref<AccessRole>('viewer')
const note = ref('')
const expiresAt = ref('')
const saving = ref(false)
const pendingRemove = ref<MemberRow | null>(null)
const removing = ref(false)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return members.value.filter((row) => {
    if (!q) return true
    return [row.login, row.role, row.note, String(row.id)]
      .join(' ')
      .toLowerCase()
      .includes(q)
  })
})

async function reload() {
  loading.value = true
  error.value = ''
  try {
    const data = await fetchMembers()
    members.value = data.members
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('auth.genericError')
  } finally {
    loading.value = false
  }
}

async function onAdd() {
  if (!props.storageConfigured || saving.value) return
  saving.value = true
  error.value = ''
  try {
    await addMember({
      login: login.value,
      role: role.value,
      note: note.value,
      expiresAt: expiresAt.value || null,
    })
    login.value = ''
    note.value = ''
    expiresAt.value = ''
    role.value = 'viewer'
    await reload()
    emit('changed')
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('auth.genericError')
  } finally {
    saving.value = false
  }
}

async function onRole(row: MemberRow, next: AccessRole) {
  if (row.locked || row.source === 'env' || next === row.role) return
  error.value = ''
  try {
    await patchMember(row.id, { role: next })
    await reload()
    emit('changed')
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('auth.genericError')
  }
}

async function confirmRemove() {
  const row = pendingRemove.value
  if (!row) return
  removing.value = true
  error.value = ''
  try {
    await removeMember(row.id)
    pendingRemove.value = null
    await reload()
    emit('changed')
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('auth.genericError')
  } finally {
    removing.value = false
  }
}

onMounted(() => {
  void reload()
})
</script>

<template>
  <div>
    <form
      class="rounded-2xl border border-line bg-surface-elevated p-4 sm:p-5"
      @submit.prevent="onAdd"
    >
      <h2 class="text-base font-bold text-ink">
        {{ $t('access.addMember') }}
      </h2>
      <fieldset
        class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
        :disabled="!storageConfigured || saving"
      >
        <label class="block text-sm font-semibold text-ink">
          {{ $t('access.username') }}
          <input
            v-model="login"
            required
            autocomplete="off"
            class="mt-1 min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm font-normal outline-none focus:border-accent"
            :placeholder="$t('access.usernamePlaceholder')"
          />
        </label>
        <label class="block text-sm font-semibold text-ink">
          {{ $t('access.role') }}
          <select
            v-model="role"
            class="mt-1 min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm font-normal outline-none focus:border-accent"
          >
            <option value="viewer">{{ $t('access.roleViewer') }}</option>
            <option value="owner">{{ $t('access.roleOwner') }}</option>
          </select>
        </label>
        <label class="block text-sm font-semibold text-ink">
          {{ $t('access.note') }}
          <input
            v-model="note"
            maxlength="200"
            class="mt-1 min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm font-normal outline-none focus:border-accent"
          />
        </label>
        <label class="block text-sm font-semibold text-ink">
          {{ $t('access.expiry') }}
          <input
            v-model="expiresAt"
            type="datetime-local"
            class="mt-1 min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm font-normal outline-none focus:border-accent"
          />
        </label>
      </fieldset>
      <button
        type="submit"
        class="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-white disabled:opacity-50"
        :disabled="!storageConfigured || saving"
      >
        {{ saving ? $t('access.saving') : $t('access.add') }}
      </button>
    </form>

    <div class="mt-5">
      <input
        v-model="query"
        type="search"
        class="min-h-11 w-full rounded-lg border border-line bg-surface-elevated px-3 text-sm outline-none focus:border-accent"
        :placeholder="$t('access.searchMembers')"
      />
    </div>

    <p v-if="error" class="mt-3 text-sm text-red-700 dark:text-red-300" role="alert">
      {{ error }}
    </p>

    <AccessSkeleton v-if="loading" class="mt-4" />

    <ul v-else class="mt-4 space-y-3">
      <li
        v-for="row in filtered"
        :key="`${row.source}-${row.id}-${row.login}`"
        class="rounded-2xl border border-line bg-surface-elevated p-4"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="font-semibold text-ink">
              @{{ row.login }}
              <span class="ml-1 text-xs font-medium text-ink-muted">
                {{ row.id ? `#${row.id}` : '' }}
              </span>
            </p>
            <p class="mt-1 text-xs text-ink-muted">
              {{ row.note || $t('access.noNote') }}
              ·
              {{
                row.expiresAt
                  ? $t('access.expiresOn', {
                      date: formatAccessDate(row.expiresAt, locale),
                    })
                  : $t('access.noExpiry')
              }}
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="rounded-md px-2 py-1 text-xs font-semibold"
              :class="
                row.role === 'owner'
                  ? 'bg-accent-soft text-accent-ink'
                  : 'border border-line text-ink-muted'
              "
            >
              {{ row.role === 'owner' ? $t('access.roleOwner') : $t('access.roleViewer') }}
            </span>
            <span
              v-if="row.locked || row.source === 'env'"
              class="rounded-md border border-line px-2 py-1 text-xs font-semibold text-ink-muted"
            >
              {{ $t('access.envOwner') }}
            </span>
          </div>
        </div>
        <div
          v-if="!row.locked && row.source !== 'env'"
          class="mt-3 flex flex-wrap gap-2"
        >
          <button
            type="button"
            class="min-h-10 rounded-lg border border-line px-3 text-sm font-semibold"
            @click="onRole(row, row.role === 'owner' ? 'viewer' : 'owner')"
          >
            {{
              row.role === 'owner'
                ? $t('access.makeViewer')
                : $t('access.makeOwner')
            }}
          </button>
          <button
            type="button"
            class="min-h-10 rounded-lg border border-line px-3 text-sm font-semibold text-red-700"
            @click="pendingRemove = row"
          >
            {{ $t('access.remove') }}
          </button>
        </div>
      </li>
      <li
        v-if="!filtered.length"
        class="rounded-2xl border border-dashed border-line px-4 py-8 text-center text-sm text-ink-muted"
      >
        {{ $t('access.emptyMembers') }}
      </li>
    </ul>

    <ConfirmDialog
      :open="Boolean(pendingRemove)"
      :title="$t('access.removeMemberTitle')"
      :message="
        $t('access.removeMemberHint', { login: pendingRemove?.login || '' })
      "
      :busy="removing"
      @cancel="pendingRemove = null"
      @confirm="confirmRemove"
    />
  </div>
</template>
