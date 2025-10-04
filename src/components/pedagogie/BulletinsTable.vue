<!-- src/components/pedagogie/BulletinsTable.vue -->
<template>
  <!-- Vue cartes (mobile) -->
  <div class="space-y-3 md:hidden">
    <div v-for="r in rows" :key="r.eleveId" class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="font-medium">{{ r.nom }}</div>
          <div class="text-xs text-slate-500 dark:text-slate-400">{{ r.classeLabel }} • {{ periodeLabel }}</div>
        </div>
        <div class="text-right">
          <div class="text-lg font-semibold">{{ formatMoy(r.moyenne) }}</div>
          <div class="text-xs text-slate-500 dark:text-slate-400">Rang {{ r.rank ?? '—' }}</div>
        </div>
      </div>

      <textarea
        v-model="localObs[r.eleveId]"
        placeholder="Observations…"
        class="mt-3 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm
               dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        rows="2"
      ></textarea>
      <div class="flex justify-end gap-2">
        <RouterLink
        :to="`/bulletins/detail?eleveId=${r.eleveId}&periodeId=${periodeId}`"
        class="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
        Détails
    </RouterLink>
      </div>
      

    </div>

    <div class="flex items-center justify-end gap-2">
      <button
        class="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 disabled:opacity-60 dark:border-violet-900"
        :disabled="saving"
        @click="$emit('save', localObs)"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5 12l4 4L19 6l-2-2-8 8-2-2-2 2z"/></svg>
        {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
      </button>
    </div>
  </div>

  <!-- Table (≥ md) -->
  <div class="hidden md:block overflow-x-auto">
    <table class="min-w-full text-left text-sm">
      <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <tr>
          <th class="px-4 py-3 font-medium">Élève</th>
          <th class="px-4 py-3 font-medium">Classe</th>
          <th class="px-4 py-3 font-medium">Période</th>
          <th class="px-4 py-3 font-medium">Moyenne</th>
          <th class="px-4 py-3 font-medium">Rang</th>
          <th class="px-4 py-3 font-medium">Observations</th>
          <th class="px-4 py-3 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="r in rows"
          :key="r.eleveId"
          class="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
        >
          <td class="px-4 py-3">{{ r.nom }}</td>
          <td class="px-4 py-3">{{ r.classeLabel }}</td>
          <td class="px-4 py-3">{{ periodeLabel }}</td>
          <td class="px-4 py-3 font-semibold">{{ formatMoy(r.moyenne) }}</td>
          <td class="px-4 py-3">{{ r.rank ?? '—' }}</td>
          <td class="px-4 py-3">
            <textarea
              v-model="localObs[r.eleveId]"
              class="w-full min-w-[18rem] rounded-lg border border-slate-200 bg-white p-2 text-sm
                     dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              rows="2"
              placeholder="Observations…"
            ></textarea>
          </td>
          <td class="px-4 py-3">
            <div class="flex justify-end gap-2">
              <!-- garde un lien détail (si tu ajoutes BulletinDetail plus tard) -->
              <RouterLink
                :to="`/bulletins/detail?eleveId=${r.eleveId}&periodeId=${periodeId}`"
                class="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Détails
              </RouterLink>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex items-center justify-end gap-2 border-t border-slate-100 px-4 py-3 text-sm dark:border-slate-800">
      <button
        class="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 disabled:opacity-60 dark:border-violet-900"
        :disabled="saving"
        @click="$emit('save', localObs)"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5 12l4 4L19 6l-2-2-8 8-2-2-2 2z"/></svg>
        {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { reactive, watch } from 'vue'

const props = defineProps({
  rows: { type: Array, default: () => [] }, // [{ eleveId, nom, classeLabel, moyenne, rank, observation }]
  periodeLabel: { type: String, default: '' },
  periodeId: { type: [String, Number], default: '' },
  saving: { type: Boolean, default: false },
})
const emit = defineEmits(['save'])

// local copy des observations pour édition
const localObs = reactive({})
watch(() => props.rows, (arr) => {
  for (const r of (arr || [])) localObs[r.eleveId] = r.observation || ''
}, { immediate: true, deep: true })

function formatMoy(n){
  if (n == null || Number.isNaN(n)) return '—'
  return Number(n).toFixed(2)
}
</script>
