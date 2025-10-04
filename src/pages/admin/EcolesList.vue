<template>
  <PageShell title="Écoles" :subtitle="`${filtered.length} établissement(s)`">
    <template #actions>
      <div class="flex items-center gap-2">
        <input
          v-model="q"
          type="search"
          placeholder="Rechercher (nom, code, ville, directeur)…"
          class="w-64 max-w-[70vw] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm
                 placeholder-slate-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500
                 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500
                 dark:focus:border-violet-400 dark:focus:ring-violet-400"
        />
        <button
          class="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm
                 border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          @click="refresh"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35A7.95 7.95 0 0 0 12 4V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 13.65-6.65z"/></svg>
          Rafraîchir
        </button>

        <!-- (Optionnel pour plus tard) -->
        <!--
        <RouterLink
          to="/admin/ecoles/new"
          class="inline-flex items-center gap-2 rounded-md bg-violet-600 px-3 py-2 text-sm text-white hover:bg-violet-700"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>
          Nouvelle école
        </RouterLink>
        -->
      </div>
    </template>

    <!-- Etat chargement/erreur -->
    <div v-if="loading" class="py-12 text-center text-slate-500">Chargement…</div>
    <div v-else-if="error" class="py-6 rounded-md border border-red-300 bg-red-50 px-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
      Une erreur est survenue. <button class="underline" @click="refresh">Réessayer</button>
    </div>

    <!-- Vide -->
    <div v-else-if="!filtered.length" class="py-12 text-center text-slate-500">
      Aucune école trouvée.
    </div>

    <!-- Tableau -->
    <div v-else class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead class="bg-slate-50 dark:bg-slate-900/50">
          <tr class="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <th class="px-4 py-3">Nom</th>
            <th class="px-4 py-3">Code</th>
            <th class="px-4 py-3">Ville</th>
            <th class="px-4 py-3">Directeur</th>
            <th class="px-4 py-3 w-24 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
          <tr v-for="e in filtered" :key="e.id" class="text-sm">
            <td class="px-4 py-3">
              <div class="font-medium">{{ e.nom || '—' }}</div>
              <div v-if="e.email || e.telephone" class="text-xs text-slate-500 dark:text-slate-400">
                <span v-if="e.email">{{ e.email }}</span>
                <span v-if="e.email && e.telephone"> • </span>
                <span v-if="e.telephone">{{ e.telephone }}</span>
              </div>
            </td>
            <td class="px-4 py-3">{{ e.code || '—' }}</td>
            <td class="px-4 py-3">{{ e.ville || '—' }}</td>
            <td class="px-4 py-3">{{ e.directeur || '—' }}</td>
            <td class="px-4 py-3">
              <div class="flex justify-end gap-2">
                <button
                  class="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100
                         dark:border-slate-700 dark:hover:bg-slate-800"
                  @click="edit(e)"
                >Éditer</button>
                <button
                  class="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50
                         dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20"
                  @click="remove(e)"
                >Suppr.</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </PageShell>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageShell from '@/components/ui/PageShell.vue'
import { useEcolesStore } from '@/stores/useEcolesStore.js'

const store = useEcolesStore()
const router = useRouter()

const q = ref('')

const loading = computed(() => store.loading)
const error   = computed(() => store.error)
const items   = computed(() => store.sorted)

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return items.value
  return items.value.filter(e => {
    const hay = [
      e.nom, e.code, e.ville, e.directeur, e.email, e.telephone
    ].filter(Boolean).join(' ').toLowerCase()
    return hay.includes(term)
  })
})

function refresh() {
  store.fetchAll(true)
}

function edit(row) {
  // plus tard: router.push(`/admin/ecoles/${row.id}/edit`)
  alert(`(MVP) Éditer #${row.id} – ${row.nom}`)
}

async function remove(row) {
  if (!confirm(`Supprimer l'école "${row.nom}" ?`)) return
  await store.remove(row.id)
}

onMounted(() => {
  store.fetchAll()
})
</script>
