<script setup lang="ts">
  import { NaiveProvider } from './providers'
  import HomePage from '../pages/HomePage/HomePage.vue'
</script>

<template>
  <NaiveProvider>
    <HomePage />
  </NaiveProvider>
</template>
