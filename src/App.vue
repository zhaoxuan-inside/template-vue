<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Hello, Vue 3 + TypeScript!')
</script>

<template>
  <div class="app">
    <h1>{{ message }}</h1>
    <p>This is a Vue 3 team development template.</p>
  </div>
</template>

<style scoped>
.app {
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}
</style>
