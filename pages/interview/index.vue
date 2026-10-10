<script setup lang="ts">
import InterviewHome from '@/modules/interview-qa/views/InterviewHome.vue'

definePageMeta({
  middleware: 'require-auth',
})
</script>

<template>
  <InterviewHome />
</template>
