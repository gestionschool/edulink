<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold">Recherche bulletin</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Sélectionnez une période, une classe et un élève.
        </p>
      </div>
    </div>

    <!-- Filtres -->
    <div class="grid gap-3 sm:grid-cols-3">
      <!-- Période -->
      <select
        v-model="periodeId"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
               focus:border-violet-500 focus:ring-1 focus:ring-violet-500
               dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      >
        <option disabled value="">Choisir une période</option>
        <option v-for="p in periodes.items" :key="p.id" :value="p.id">
          {{ p.label }}
        </option>
      </select>

      <!-- Classe -->
      <select
        v-model="classeId"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
               focus:border-violet-500 focus:ring-1 focus:ring-violet-500
               dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      >
        <option value="">Toutes classes</option>
        <option v-for="c in classes.items" :key="c.id" :value="c.id">
          {{ c.libelle || c.label || c.code }}
        </option>
      </select>

      <!-- Recherche élève -->
      <input
        v-model="q"
        type="search"
        placeholder="Rechercher un élève (nom, matricule)…"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
               focus:border-violet-500 focus:ring-1 focus:ring-violet-500
               dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      />
    </div>

    <!-- État -->
    <div
      v-if="loading"
      class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="h-4 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800 mb-3"></div>
      <div class="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800 mb-2"></div>
      <div class="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
    </div>

    <div v-else-if="error" class="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-red-600 dark:border-slate-800 dark:bg-slate-900 dark:text-red-400">
      {{ error }}
    </div>

    <!-- Résultats -->
    <div
      v-else
      class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div v-if="rows.length === 0" class="p-6 text-sm text-slate-500 dark:text-slate-400">
        Aucun élève trouvé.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th class="px-4 py-3 font-medium">Élève</th>
              <th class="px-4 py-3 font-medium">Matricule</th>
              <th class="px-4 py-3 font-medium">Classe</th>
              <th class="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="e in rows"
              :key="e.id"
              class="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
            >
              <td class="px-4 py-3">{{ e.nom }}</td>
              <td class="px-4 py-3">{{ e.matricule || '—' }}</td>
              <td class="px-4 py-3">{{ e.classeLabel }}</td>
              <td class="px-4 py-3">
                <div class="flex justify-end">
                  <RouterLink
                    :to="`/bulletins/detail?eleveId=${e.id}&periodeId=${periodeId}`"
                    class="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    Voir le bulletin
                  </RouterLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm dark:border-slate-800">
          <span class="text-slate-500 dark:text-slate-400">
            {{ rows.length }} résultat(s)
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

// Stores
import { useStudents } from '@/stores/useStudents'
import { useClasses } from '@/stores/useClasses'
import { usePeriodes } from '@/stores/usePeriodes'

const students = useStudents()
const classes  = useClasses()
const periodes = usePeriodes()

const periodeId = ref('')
const classeId  = ref('')
const q         = ref('')

const error   = ref(null)

onMounted(async () => {
  try {
    await Promise.all([
      periodes.fetch(),
      classes.fetch(),
      students.fetch(),
    ])
    // période par défaut : active sinon première
    const active = (periodes.items || []).find(p => p.active)
    periodeId.value = active?.id ?? (periodes.items?.[0]?.id ?? '')
  } catch (e) {
    error.value = e?.message || 'Erreur de chargement'
  }
})

const loading = computed(() =>
  students.loading || classes.loading || periodes.loading
)

const classById = computed(() =>
  Object.fromEntries((classes.items || []).map(c => [c.id, c]))
)

const rows = computed(() => {
  const term = q.value.trim().toLowerCase()
  return (students.items || [])
    .filter(e => {
      if (classeId.value && e.classeId !== Number(classeId.value)) return false
      if (!term) return true
      const hay = `${e.nom || ''} ${e.matricule || ''}`.toLowerCase()
      return hay.includes(term)
    })
    .map(e => ({
      ...e,
      classeLabel: classById.value[e.classeId]?.libelle
                 || classById.value[e.classeId]?.label
                 || classById.value[e.classeId]?.code
                 || '—',
    }))
})
</script>
