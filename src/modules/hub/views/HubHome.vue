<script setup lang="ts">
import AuthMenu from '@/modules/core/components/AuthMenu/AuthMenu.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'
import { HUB_MODULES } from '@/modules/hub/constants/hub-modules.constant'
</script>

<template>
  <div class="mx-auto max-w-hub px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
    <header class="animate-fade-up flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
      <div class="max-w-2xl">
        <p class="text-sm font-semibold uppercase tracking-[0.14em] text-accent-ink">
          {{ $t('hub.brand') }}
        </p>
        <h1 class="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          {{ $t('hub.headline') }}
        </h1>
        <p class="mt-4 max-w-xl text-base text-ink-muted sm:text-lg">
          {{ $t('hub.sub') }}
        </p>
      </div>
      <div class="flex items-center gap-2 self-start">
        <AuthMenu />
        <LocaleToggle />
        <ThemeToggle />
      </div>
    </header>

    <section
      class="mt-10 grid grid-cols-1 items-start gap-4 sm:mt-12 sm:gap-5 md:grid-cols-2 lg:grid-cols-3"
      aria-label="Modules"
    >
      <NuxtLink
        v-for="(mod, index) in HUB_MODULES"
        :key="mod.id"
        :to="mod.to"
        class="animate-fade-up group flex flex-col rounded-2xl border border-line bg-surface-elevated p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md sm:p-6"
        :style="{ animationDelay: `${80 + index * 60}ms` }"
      >
        <h2 class="text-xl font-bold text-ink sm:text-2xl">
          {{ $t(mod.titleKey) }}
        </h2>
        <p class="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
          {{ $t(mod.descKey) }}
        </p>
        <span
          class="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-accent-ink transition group-hover:gap-2"
        >
          {{ $t(mod.ctaKey) }}
          <span aria-hidden="true" class="ml-1">→</span>
        </span>
      </NuxtLink>
    </section>
  </div>
</template>
