<script setup lang="ts">
import PlanHome from '@/modules/study-plan/views/PlanHome.vue'
import { PlanRoute } from '@/modules/study-plan/enums/plan-routes.enum'

definePageMeta({
  name: PlanRoute.Home,
})
</script>

<template>
  <PlanHome />
</template>
