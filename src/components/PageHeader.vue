<!-- components/PageHeader.vue -->
<template>
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
      {{ title }}
    </h1>
    <slot name="actions" />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>
