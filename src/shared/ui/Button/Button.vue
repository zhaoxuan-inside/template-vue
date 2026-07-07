<script setup lang="ts">
  import { computed } from 'vue'

  interface Props {
    variant?: 'primary' | 'secondary' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    disabled: false,
  })

  const buttonClass = computed(() => {
    const baseClass =
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
    const variantClass = {
      primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary',
      secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300',
      danger: 'bg-danger text-white hover:bg-red-600 focus:ring-danger',
    }[props.variant]
    const sizeClass = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }[props.size]
    const disabledClass = props.disabled ? 'opacity-50 cursor-not-allowed' : ''
    return `${baseClass} ${variantClass} ${sizeClass} ${disabledClass}`
  })
</script>

<template>
  <button :class="buttonClass" :disabled="disabled">
    <slot></slot>
  </button>
</template>
