<template>
  <div class="overflow-x-auto">
    <table class="min-w-full text-left text-sm">
      <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <tr>
          <th class="px-4 py-3 font-medium">Code</th>
          <th class="px-4 py-3 font-medium">Libellé</th>
          <th class="px-4 py-3 font-medium">Niveau</th>
          <th class="px-4 py-3 font-medium">Filière</th>
          <th class="px-4 py-3 font-medium">Effectif</th>
          <th class="px-4 py-3 font-medium">Titulaire</th>
          <th class="px-4 py-3 font-medium text-right">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="c in props.items"
          :key="c.id"
          class="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
        >
          <td class="px-4 py-3">{{ c.code }}</td>
          <td class="px-4 py-3">{{ c.libelle || c.label }}</td>
          <td class="px-4 py-3">{{ c.niveau }}</td>
          <td class="px-4 py-3">{{ c.filiere }}</td>
          <td class="px-4 py-3">{{ c.effectif ?? 0 }}</td>
          <td class="px-4 py-3">{{ c.titulaire || '—' }}</td>
          <td class="px-4 py-3">
            <div class="flex justify-end gap-2">
              <RouterLink
                :to="`/classes/detail?id=${c.id}`"
                class="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Détails
              </RouterLink>
              <button
                class="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
                @click="$emit('remove', c.id)"
              >
                Supprimer
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm dark:border-slate-800">
      <span class="text-slate-500 dark:text-slate-400">
        {{ (props.items || []).length }} / {{ props.total }} éléments
      </span>
      <slot name="pagination" />
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

// Runtime props + valeurs par défaut pour éviter "undefined"
const props = defineProps({
  items: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
})

defineEmits(['remove'])
</script>
