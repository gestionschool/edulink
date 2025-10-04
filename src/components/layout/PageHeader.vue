<template>
  <header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-xl font-semibold">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm text-slate-500 dark:text-slate-400">
        {{ subtitle }}
      </p>
    </div>
    <div class="flex flex-wrap gap-2">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>
