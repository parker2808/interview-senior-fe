<script setup lang="ts">
const { locale, setLocale } = useI18n()

function toggle(code: 'vi' | 'en') {
  setLocale(code)
}
</script>

<template>
  <div
    class="inline-flex rounded-lg border border-line bg-surface-elevated p-0.5 text-sm font-semibold"
    role="group"
    :aria-label="$t('hub.locale')"
  >
    <button
      type="button"
      class="min-h-10 min-w-10 rounded-md px-2.5 transition sm:min-h-9"
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
      class="min-h-10 min-w-10 rounded-md px-2.5 transition sm:min-h-9"
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
