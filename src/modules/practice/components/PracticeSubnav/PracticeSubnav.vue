<script setup lang="ts">
defineProps<{
  active: 'steps' | 'design'
  designAvailable: boolean
}>()

const linkClass =
  'inline-flex min-h-10 items-center rounded-lg border px-3 text-sm font-semibold transition'
</script>

<template>
  <nav
    v-if="designAvailable"
    class="flex flex-wrap gap-2"
    :aria-label="$t('practice.moduleNav')"
  >
    <NuxtLink
      to="/practice"
      :class="[
        linkClass,
        active === 'steps'
          ? 'border-accent bg-accent-soft text-accent-ink'
          : 'border-line bg-surface-elevated text-ink hover:border-accent hover:text-accent-ink',
      ]"
      :aria-current="active === 'steps' ? 'page' : undefined"
    >
      {{ $t('practice.navSteps') }}
    </NuxtLink>
    <NuxtLink
      to="/practice/design"
      :class="[
        linkClass,
        active === 'design'
          ? 'border-accent bg-accent-soft text-accent-ink'
          : 'border-line bg-surface-elevated text-ink hover:border-accent hover:text-accent-ink',
      ]"
      :aria-current="active === 'design' ? 'page' : undefined"
    >
      {{ $t('practice.navDesign') }}
    </NuxtLink>
  </nav>
</template>
