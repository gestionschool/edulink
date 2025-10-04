<template>
  <li class="p-4">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {{ item.code }}
          </span>
          <h3 class="truncate text-sm font-semibold">
            {{ item.libelle || item.label }}
          </h3>
        </div>
        <p class="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
          Niveau {{ item.niveau }} • {{ item.filiere }} • {{ item.effectif ?? 0 }} élèves
        </p>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Titulaire :
          <span class="font-medium text-slate-700 dark:text-slate-200">{{ item.titulaire || '—' }}</span>
        </p>
      </div>

      <div class="shrink-0 space-x-2">
        <RouterLink
          :to="{ path: '/classes/detail', query: { id: item.id } }"
          class="inline-flex items-center rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >Détails</RouterLink>

        <button
          type="button"
          class="inline-flex items-center rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
          @click="emit('remove', item.id)"
        >Supprimer</button>
      </div>
    </div>
  </li>
</template>

<script setup>
import { RouterLink } from 'vue-router'

// on crée bien la variable `item` utilisable dans le template
const { item } = defineProps({
  item: { type: Object, required: true },
})

// on déclare l'événement 'remove'
const emit = defineEmits(['remove'])
</script>
