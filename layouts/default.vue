<script setup lang="ts">
import ScrollToTop from '@/modules/core/components/ScrollToTop/ScrollToTop.vue'
</script>

<template>
  <!-- Avoid min-h-screen wrapper adding outer overflow on docs h-dvh pages -->
  <div class="relative">
    <slot />
    <ScrollToTop />
  </div>
</template>
