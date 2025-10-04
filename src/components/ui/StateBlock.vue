<template>
  <!-- Loading -->
  <div v-if="loading" class="p-6">
    <div class="mb-3 h-4 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
    <div class="mb-2 h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
    <div class="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
  </div>

  <!-- Error -->
  <div v-else-if="error" class="p-6 text-sm text-red-600 dark:text-red-400">
    {{ error }}
  </div>

  <!-- Empty -->
  <div v-else-if="empty" class="p-6 text-sm text-slate-500 dark:text-slate-400">
    {{ emptyText }}
  </div>

  <!-- Sinon laisse le slot afficher le contenu -->
  <slot v-else />
</template>

<script setup>
defineProps({
  loading: { type: Boolean, default: false },
  // pas de type pour éviter les warnings si null ; défaut à null
  error:   { default: null },
  empty:   { type: Boolean, default: false },
  emptyText: { type: String, default: 'Aucune donnée.' },
})
</script>
