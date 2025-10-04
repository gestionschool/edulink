<!-- src/pages/presence/PresencesStats.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold">Présences — Statistiques</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Période agrégée par classe et élève</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
          @click="printPage"
        >
          Imprimer
        </button>
      </div>
    </div>

    <!-- Filtres -->
    <div class="grid gap-3 md:grid-cols-4">
      <input v-model="dateFrom" type="date" class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100" />
      <input v-model="dateTo"   type="date" class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100" />
      <select v-model.number="classeId" class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        <option value="">Toutes classes</option>
        <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.libelle || c.label || c.code }}</option>
      </select>
      <select v-model="groupBy" class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        <option value="classe">Grouper par classe</option>
        <option value="eleve">Grouper par élève</option>
      </select>
    </div>

    <!-- KPIs -->
    <div class="grid gap-3 sm:grid-cols-3">
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="text-xs text-slate-500 dark:text-slate-400">Présents</div>
        <div class="mt-1 text-2xl font-semibold">{{ totals.P }}</div>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="text-xs text-slate-500 dark:text-slate-400">Absents</div>
        <div class="mt-1 text-2xl font-semibold">{{ totals.A }}</div>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="text-xs text-slate-500 dark:text-slate-400">Retards</div>
        <div class="mt-1 text-2xl font-semibold">{{ totals.R }}</div>
      </div>
    </div>

    <!-- Tableau agrégé -->
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th class="px-4 py-3 font-medium">{{ groupBy === 'classe' ? 'Classe' : 'Élève' }}</th>
              <th class="px-4 py-3 font-medium">P</th>
              <th class="px-4 py-3 font-medium">A</th>
              <th class="px-4 py-3 font-medium">R</th>
              <th class="px-4 py-3 font-medium">Total</th>
              <th class="px-4 py-3 font-medium">Taux présence</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.key" class="border-t border-slate-100 dark:border-slate-800">
              <td class="px-4 py-3 font-medium">{{ row.label }}</td>
              <td class="px-4 py-3">{{ row.P }}</td>
              <td class="px-4 py-3">{{ row.A }}</td>
              <td class="px-4 py-3">{{ row.R }}</td>
              <td class="px-4 py-3">{{ row.total }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="h-2 w-40 rounded bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div class="h-2 bg-emerald-500" :style="{ width: row.rate + '%' }"></div>
                  </div>
                  <span class="text-xs text-slate-600 dark:text-slate-300">{{ row.rate.toFixed(0) }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="border-t border-slate-100 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          {{ tableRows.length }} lignes
        </div>
      </div>
    </div>

    <!-- Top absences -->
    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 class="text-sm font-semibold">Top absences</h2>
      <div class="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="t in topAbsences" :key="t.key" class="rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-800">
          <div class="font-medium">{{ t.label }}</div>
          <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Absences: {{ t.A }} — Retards: {{ t.R }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { usePresencesStore } from '@/stores/usePresences'
import { useClassesStore } from '@/stores/useClasses'
import { useStudentsStore } from '@/stores/useStudents'
import { useCoursStore } from '@/stores/useCours'

const pres = usePresencesStore()
const classesStore = useClassesStore()
const studentsStore= useStudentsStore()
const coursStore   = useCoursStore()

const today = new Date().toISOString().slice(0,10)
const dateFrom = ref(today)
const dateTo   = ref(today)
const classeId = ref('')
const groupBy  = ref('classe') // 'classe' | 'eleve'

// load référentiels + première fetch
onMounted(async () => {
  await Promise.all([
    classesStore.fetch(),
    studentsStore.fetch(),
    coursStore.fetch(),
  ])
  await fetchPresences()
})

// refetch when filters change
watch([dateFrom, dateTo, classeId], fetchPresences)

function fetchPresences(){
  const params = {
    ...(dateFrom.value ? { date_gte: dateFrom.value } : {}),
    ...(dateTo.value   ? { date_lte: dateTo.value }   : {}),
    ...(classeId.value ? { classeId: Number(classeId.value) } : {}),
    _limit: 5000, // par sécurité, pour éviter trop de pages
  }
  return pres.fetch(params)
}

const classes = computed(() => classesStore.items || [])
const classById   = computed(() => classesStore.byId || {})
const studentById = computed(() => studentsStore.byId || {})

// Totaux globaux
const totals = computed(() => {
  const out = { P: 0, A: 0, R: 0 }
  ;(pres.items || []).forEach(p => { out[p.statut] = (out[p.statut] || 0) + 1 })
  return out
})

// Grouping
const grouped = computed(() => {
  const map = {}
  ;(pres.items || []).forEach(p => {
    const key = groupBy.value === 'classe'
      ? (p.classeId ?? 'NA')
      : (p.eleveId ?? 'NA')
    if (!map[key]) map[key] = { key, P:0, A:0, R:0, total:0 }
    const bucket = map[key]
    bucket[p.statut] = (bucket[p.statut] || 0) + 1
    bucket.total++
  })
  return Object.values(map)
})

// Rows with labels + rate
const tableRows = computed(() =>
  grouped.value.map(g => {
    let label = ''
    if (groupBy.value === 'classe') {
      const c = classById.value[g.key]
      label = c ? (c.libelle || c.label || c.code) : `Classe #${g.key}`
    } else {
      const s = studentById.value[g.key]
      label = s ? (s.nom || s.name) : `Élève #${g.key}`
    }
    const P = g.P || 0, A = g.A || 0, R = g.R || 0, total = g.total || 0
    const rate = total ? (P / total) * 100 : 0
    return { ...g, label, P, A, R, total, rate }
  }).sort((a,b) => b.total - a.total)
)

// Top absences (par groupe actuel)
const topAbsences = computed(() =>
  [...tableRows.value]
    .sort((a,b) => (b.A - a.A) || (b.R - a.R))
    .slice(0, 6)
)

function printPage(){ window.print() }
</script>
