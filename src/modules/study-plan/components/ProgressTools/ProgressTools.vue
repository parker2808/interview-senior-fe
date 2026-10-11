<script setup lang="ts">
const props = defineProps<{
  source: string
  readOnly: boolean
  isEditMode: boolean
  statusMessage: string
  publicMeta: { owner: string | null; updatedAt: string | null } | null
}>()

const emit = defineEmits<{
  'use-local': []
  'load-public': []
  'load-cloud': []
  'publish-cloud': []
  'copy-share': []
  export: []
  'import-file': [file: File]
  'request-unlock': []
}>()

const { t } = useI18n()
const { loggedIn } = useUserSession()
const fileInput = ref<HTMLInputElement | null>(null)
const toolsOpen = ref(false)

const sourceLabel = computed<Record<string, string>>(() => ({
  local: t('plan.sourceLocal'),
  share: t('plan.sourceShare'),
  public: t('plan.sourcePublic'),
  cloud: t('plan.sourceCloud'),
}))

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) emit('import-file', file)
  ;(e.target as HTMLInputElement).value = ''
}

function onImportClick() {
  if (!props.isEditMode) {
    emit('request-unlock')
    return
  }
  fileInput.value?.click()
}
</script>

<template>
  <section class="rounded-xl border border-line bg-surface-elevated/80 p-3 sm:p-4">
    <div
      v-if="!isEditMode"
      class="mb-3 rounded-lg border border-line bg-accent-soft px-3 py-2 text-sm text-ink"
      role="status"
    >
      {{ loggedIn ? $t('plan.viewerOnlyHint') : $t('plan.viewOnlyHint') }}
      <button
        v-if="!loggedIn"
        type="button"
        class="ml-1 font-semibold text-accent-ink underline"
        @click="emit('request-unlock')"
      >
        {{ $t('plan.signInToEdit') }}
      </button>
    </div>
    <div
      v-else-if="readOnly"
      class="mb-3 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink"
      role="status"
    >
      <strong>{{ $t('plan.readOnlyProgress') }}</strong>
      <span v-if="publicMeta?.owner"> · {{ publicMeta.owner }}</span>
      <button
        type="button"
        class="ml-1 font-semibold text-accent-ink underline"
        @click="emit('use-local')"
      >
        {{ $t('plan.backToLocal') }}
      </button>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2">
      <p class="text-sm text-ink-muted">
        {{ $t('plan.progressSource') }}
        <strong class="text-ink">{{ sourceLabel[source] || source }}</strong>
      </p>
      <button
        type="button"
        class="min-h-10 rounded-lg border border-line bg-surface-elevated px-3 text-sm font-semibold text-ink md:hidden"
        @click="toolsOpen = !toolsOpen"
      >
        {{ toolsOpen ? $t('plan.hideTools') : $t('plan.progressTools') }}
      </button>
    </div>

    <div
      class="mt-3 flex flex-wrap gap-2"
      :class="toolsOpen ? 'flex' : 'hidden md:flex'"
    >
      <button type="button" class="btn" @click="emit('use-local')">
        {{ $t('plan.toolLocal') }}
      </button>
      <button
        v-if="isEditMode"
        type="button"
        class="btn"
        @click="emit('load-cloud')"
      >
        {{ $t('plan.toolCloud') }}
      </button>
      <button type="button" class="btn" @click="emit('load-public')">
        {{ $t('plan.toolPublic') }}
      </button>
      <button
        v-if="isEditMode"
        type="button"
        class="btn"
        @click="emit('publish-cloud')"
      >
        {{ $t('plan.toolPublish') }}
      </button>
      <button type="button" class="btn" @click="emit('copy-share')">
        {{ $t('plan.toolShare') }}
      </button>
      <button type="button" class="btn" @click="emit('export')">
        {{ $t('plan.toolExport') }}
      </button>
      <button
        v-if="isEditMode"
        type="button"
        class="btn"
        @click="onImportClick"
      >
        {{ $t('plan.toolImport') }}
      </button>
      <input
        ref="fileInput"
        type="file"
        accept="application/json,.json"
        class="hidden"
        @change="onFileChange"
      />
    </div>

    <p v-if="statusMessage" class="mt-2 text-xs text-ink-muted" aria-live="polite">
      {{ statusMessage }}
    </p>
  </section>
</template>

<style scoped>
.btn {
  @apply min-h-10 rounded-lg border border-line bg-surface-elevated px-3 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent-ink;
}
</style>
