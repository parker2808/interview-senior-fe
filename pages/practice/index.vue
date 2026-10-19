<script setup lang="ts">
import PracticeHome from '@/modules/practice/views/PracticeHome.vue'
import { PracticeRoute } from '@/modules/practice/enums/practice-routes.enum'

definePageMeta({
  name: PracticeRoute.Home,
})
</script>

<template>
  <PracticeHome />
</template>
