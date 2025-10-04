<!-- src/components/pedagogie/ExamensTable.vue -->
<template>
  <!-- Cards mobile -->
  <div class="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
    <div v-for="r in items" :key="r.id" class="p-4">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <div class="font-semibold">{{ r.titre }}</div>
          <div class="text-xs text-slate-500 dark:text-slate-400">
            {{ r._coursLabel }} • {{ r._classeLabel }}
          </div>
        </div>
        <button
          class="shrink-0 rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
          @click="$emit('remove', r.id)"
        >Supprimer</button>
      </div>
      <div class="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
        <div><span class="opacity-60">Type:</span> {{ r.type || '—' }}</div>
        <div><span class="opacity-60">Session:</span> {{ r.session || '—' }}</div>
        <div><span class="opacity-60">Date:</span> {{ formatDate(r.date) }}</div>
        <div><span class="opacity-60">Barème:</span> {{ r.bareme ?? 20 }}</div>
        <div class="col-span-2"><span class="opacity-60">Période:</span> {{ r._periodeLabel }}</div>
        <div class="col-span-2"><span class="opacity-60">Prof:</span> {{ r._profLabel }}</div>
      </div>
    </div>
  </div>

  <!-- Table desktop -->
  <table class="hidden min-w-full text-left text-sm md:table">
    <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      <tr>
        <th class="px-4 py-3 font-medium">Titre</th>
        <th class="px-4 py-3 font-medium">Type</th>
        <th class="px-4 py-3 font-medium">Session</th>
        <th class="px-4 py-3 font-medium">Cours</th>
        <th class="px-4 py-3 font-medium">Classe</th>
        <th class="px-4 py-3 font-medium">Période</th>
        <th class="px-4 py-3 font-medium">Date</th>
        <th class="px-4 py-3 font-medium">Barème</th>
        <th class="px-4 py-3 font-medium text-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="r in items"
        :key="r.id"
        class="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
      >
        <td class="px-4 py-3">{{ r.titre }}</td>
        <td class="px-4 py-3">{{ r.type || '—' }}</td>
        <td class="px-4 py-3">{{ r.session || '—' }}</td>
        <td class="px-4 py-3">{{ r._coursLabel }}</td>
        <td class="px-4 py-3">{{ r._classeLabel }}</td>
        <td class="px-4 py-3">{{ r._periodeLabel }}</td>
        <td class="px-4 py-3">{{ formatDate(r.date) }}</td>
        <td class="px-4 py-3">{{ r.bareme ?? 20 }}</td>
        <td class="px-4 py-3">
          <div class="flex justify-end gap-2">
            <RouterLink
              :to="`/examens/detail?id=${r.id}`"
              class="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Détails
            </RouterLink>
            <button
              class="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
              @click="$emit('remove', r.id)"
            >
              Supprimer
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Footer count -->
  <div class="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm dark:border-slate-800">
    <span class="text-slate-500 dark:text-slate-400">
      {{ items.length }} / {{ total }} éléments
    </span>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
defineProps({
  items: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
})
defineEmits(['remove'])

function formatDate(d){
  if (!d) return '—'
  try { return new Date(d).toLocaleDateString() } catch { return d }
}
</script>
