<script setup lang="ts">
import AccessAdmin from '@/modules/access/views/AccessAdmin.vue'

definePageMeta({
  middleware: 'require-owner',
})
</script>

<template>
  <AccessAdmin />
</template>
