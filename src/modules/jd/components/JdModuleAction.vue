<script setup lang="ts">
import type { JdActionHandoff } from '@/modules/jd/types/entities/jd-module.type'

const props = defineProps<{ action: JdActionHandoff; kind: 'delete' | 'restore' }>()
const { t } = useI18n()
const copied = ref(false)
async function copyCommand() {
  try {
    await navigator.clipboard.writeText(props.action.command)
    copied.value = true
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <div class="mt-3 min-w-0 break-words border-t border-line pt-3 text-sm text-ink">
    <p>{{ t(`jd.${kind}${action.deepLink ? 'LinkHint' : 'Hint'}`) }}</p>
    <div v-if="!action.deepLink" class="mt-2 flex min-w-0 flex-wrap items-center gap-2">
      <code class="max-w-full break-all rounded bg-accent-soft px-2 py-1">{{ action.command }}</code>
      <button type="button" class="min-h-11 rounded-lg border border-line px-3 text-accent-ink" :aria-label="t('jd.copyCommand', { command: action.command })" @click="copyCommand">{{ copied ? t('jd.copied') : t('jd.copy') }}</button>
    </div>
    <a v-if="action.url" :href="action.url" rel="noopener noreferrer" target="_blank" class="mt-2 inline-flex min-h-11 items-center rounded-lg border border-line px-3 text-accent-ink" :aria-label="t(`jd.${kind}Telegram`)">{{ t(`jd.${kind}Telegram`) }}</a>
    <p v-else class="mt-2 text-ink-muted">{{ t('jd.telegramUnavailable') }}</p>
  </div>
</template>
