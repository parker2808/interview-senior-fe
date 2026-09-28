<script setup lang="ts">
const { locale, setLocale } = useI18n()

function toggle(code: 'vi' | 'en') {
  setLocale(code)
}
</script>

<template>
  <div
    class="inline-flex shrink-0 rounded-lg border border-line bg-surface-elevated p-0.5 text-xs font-semibold"
    role="group"
    :aria-label="$t('hub.locale')"
  >
    <button
      type="button"
      class="inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 transition"
      :class="
        locale === 'vi'
          ? 'bg-accent text-white'
          : 'text-ink-muted hover:text-ink'
      "
      @click="toggle('vi')"
    >
      {{ $t('common.vi') }}
    </button>
    <button
      type="button"
      class="inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 transition"
      :class="
        locale === 'en'
          ? 'bg-accent text-white'
          : 'text-ink-muted hover:text-ink'
      "
      @click="toggle('en')"
    >
      {{ $t('common.en') }}
    </button>
  </div>
</template>
