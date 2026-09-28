<script setup lang="ts">
import ScrollToTop from '@/modules/core/components/ScrollToTop/ScrollToTop.vue'
</script>

<template>
  <div class="min-h-screen">
    <slot />
    <ScrollToTop />
  </div>
</template>
