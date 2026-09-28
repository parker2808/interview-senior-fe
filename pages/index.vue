<script setup lang="ts">
import HubHome from '@/modules/hub/views/HubHome.vue'
import { HubRoute } from '@/modules/hub/enums/hub-routes.enum'

definePageMeta({
  name: HubRoute.Home,
})
</script>

<template>
  <HubHome />
</template>
