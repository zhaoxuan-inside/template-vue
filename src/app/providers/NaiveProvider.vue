<script setup lang="ts">
  import { NConfigProvider, zhCN, dateZhCN } from 'naive-ui'

  defineProps<{
    themeOverrides?: Record<string, unknown>
  }>()
</script>

<template>
  <NConfigProvider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeOverrides">
    <slot></slot>
  </NConfigProvider>
</template>
