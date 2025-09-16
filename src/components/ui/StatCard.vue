<!-- src/components/ui/StatCard.vue -->
<template>
  <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm
              dark:border-gray-700 dark:bg-gray-900">
    <div class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
      {{ label }}
    </div>
    <div class="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
      {{ value }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true }
})
</script>
