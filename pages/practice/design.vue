<script setup lang="ts">
import PracticeDesign from '@/modules/practice/views/PracticeDesign.vue'
import { PracticeRoute } from '@/modules/practice/enums/practice-routes.enum'

definePageMeta({
  name: PracticeRoute.Design,
})
</script>

<template>
  <PracticeDesign />
</template>
