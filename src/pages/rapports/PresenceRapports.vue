<!-- src/pages/rapports/PresenceRapports.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold">Rapports de présence</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Taux de présence/absence/retard par classe, élève ou par jour.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
          @click="window.print()"
        >
          Imprimer
        </button>
        <button
          type="button"
          class="rounded-md border border-violet-200 bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 dark:border-violet-900"
          @click="exportCSV"
          :disabled="rowsAgg.length === 0"
        >
          Export CSV
        </button>
      </div>
    </div>

    <!-- Filtres -->
    <div class="grid gap-3 md:grid-cols-5">
      <select v-model="groupMode"
              class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        <option value="classe">Par classe</option>
        <option value="eleve">Par élève</option>
        <option value="jour">Par jour</option>
      </select>

      <input v-model="start" type="date"
             class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100" />
      <input v-model="end" type="date"
             class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100" />

      <select v-model.number="classeId"
              class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        <option value="">— Toutes classes —</option>
        <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.libelle || c.label || c.code }}</option>
      </select>

      <select v-model="statutFilter"
              class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        <option value="">— Tous statuts —</option>
        <option value="P">Présent</option>
        <option value="A">Absent</option>
        <option value="R">Retard</option>
      </select>
    </div>

    <!-- États -->
    <div v-if="loadingAny" class="rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-800">Chargement…</div>
    <div v-else-if="errorAny" class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
      {{ errorAny }}
    </div>
    <div v-else-if="rowsAgg.length === 0" class="rounded-xl border border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      Aucun enregistrement pour ces filtres.
    </div>

    <!-- KPI -->
    <div v-else class="grid gap-3 sm:grid-cols-4">
      <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <div class="text-xs text-slate-500 dark:text-slate-400">Présences</div>
        <div class="mt-1 text-2xl font-semibold">{{ kpi.P }}</div>
      </div>
      <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <div class="text-xs text-slate-500 dark:text-slate-400">Absences</div>
        <div class="mt-1 text-2xl font-semibold">{{ kpi.A }}</div>
      </div>
      <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <div class="text-xs text-slate-500 dark:text-slate-400">Retards</div>
        <div class="mt-1 text-2xl font-semibold">{{ kpi.R }}</div>
      </div>
      <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <div class="text-xs text-slate-500 dark:text-slate-400">Taux de présence</div>
        <div class="mt-1 text-2xl font-semibold">{{ (kpi.tauxPresence * 100).toFixed(0) }}%</div>
      </div>
    </div>

    <!-- Tableau -->
    <div v-if="rowsAgg.length" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm dark:border-slate-800">
        <span class="text-slate-600 dark:text-slate-300">{{ titleTable }}</span>
        <span class="text-slate-500 dark:text-slate-400">{{ rowsAgg.length }} ligne(s)</span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th class="px-4 py-3 font-medium sticky left-0 bg-slate-50 dark:bg-slate-800">
                {{ groupHeader }}
              </th>
              <th class="px-4 py-3 font-medium">Présent</th>
              <th class="px-4 py-3 font-medium">Absent</th>
              <th class="px-4 py-3 font-medium">Retard</th>
              <th class="px-4 py-3 font-medium">Total</th>
              <th class="px-4 py-3 font-medium">Taux présence</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rowsAgg" :key="r.key"
                class="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60">
              <td class="px-4 py-3 font-medium sticky left-0 bg-white dark:bg-slate-900">{{ r.label }}</td>
              <td class="px-4 py-3">{{ r.P }}</td>
              <td class="px-4 py-3">{{ r.A }}</td>
              <td class="px-4 py-3">{{ r.R }}</td>
              <td class="px-4 py-3">{{ r.total }}</td>
              <td class="px-4 py-3">{{ (r.tauxPresence * 100).toFixed(0) }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { usePresencesStore } from '@/stores/usePresences'
import { useClassesStore }   from '@/stores/useClasses'
import { useStudentsStore }  from '@/stores/useStudents'
import { useCoursStore }     from '@/stores/useCours'
import { usePeriodesStore }  from '@/stores/usePeriodes'

const presS   = usePresencesStore()
const classesS= useClassesStore()
const studsS  = useStudentsStore()
const coursS  = useCoursStore()
const perS    = usePeriodesStore()

// Filtres
const groupMode = ref('classe') // 'classe' | 'eleve' | 'jour'
const today = new Date().toISOString().slice(0,10)
const monthAgo = new Date(Date.now() - 29*86400000).toISOString().slice(0,10)
const start = ref(monthAgo)
const end   = ref(today)
const classeId = ref('')
const statutFilter = ref('') // '', 'P', 'A', 'R'

// Chargement
onMounted(async () => {
  await Promise.all([
    classesS.fetch(),
    studsS.fetch(),
    coursS.fetch(),
    perS.fetch?.(),
    presS.fetch(), // tout ; json-server est léger
  ])
})

const loadingAny = computed(() =>
  presS.loading || classesS.loading || studsS.loading || coursS.loading || perS.loading
)
const errorAny = computed(() =>
  presS.error?.message || classesS.error?.message || studsS.error?.message || coursS.error?.message || perS.error?.message || null
)

const classes = computed(() => classesS.items || [])
const studsById = computed(() => Object.fromEntries((studsS.items||[]).map(s => [s.id, s])))
const classesById = computed(() => Object.fromEntries((classesS.items||[]).map(c => [c.id, c])))

function inRange(d, a, b) { return (!a || d >= a) && (!b || d <= b) }

const presFiltered = computed(() => {
  return (presS.items || []).filter(p => {
    if (!inRange(p.date, start.value, end.value)) return false
    if (classeId.value && Number(p.classeId) !== Number(classeId.value)) return false
    if (statutFilter.value && p.statut !== statutFilter.value) return false
    return true
  })
})

function aggregate(list, getKey, getLabel) {
  const map = new Map()
  list.forEach(r => {
    const key = getKey(r)
    const bucket = map.get(key) || { key, label: getLabel(r), P:0, A:0, R:0, total:0 }
    if (r.statut === 'P') bucket.P++
    else if (r.statut === 'A') bucket.A++
    else if (r.statut === 'R') bucket.R++
    bucket.total++
    map.set(key, bucket)
  })
  const arr = Array.from(map.values()).map(b => ({ ...b, tauxPresence: b.total ? b.P / b.total : 0 }))
  // Tri décroissant par taux de présence puis total
  arr.sort((a,b) => (b.tauxPresence - a.tauxPresence) || (b.total - a.total))
  return arr
}

const rowsAgg = computed(() => {
  if (groupMode.value === 'eleve') {
    return aggregate(
      presFiltered.value,
      (r) => r.eleveId,
      (r) => studsById.value[r.eleveId]?.nom || `Élève #${r.eleveId}`
    )
  }
  if (groupMode.value === 'jour') {
    return aggregate(
      presFiltered.value,
      (r) => r.date,
      (r) => r.date
    )
  }
  // classe (défaut)
  return aggregate(
    presFiltered.value,
    (r) => r.classeId,
    (r) => {
      const c = classesById.value[r.classeId]
      return c ? (c.libelle || c.label || c.code) : `Classe #${r.classeId}`
    }
  )
})

const kpi = computed(() => {
  const P = presFiltered.value.filter(p => p.statut==='P').length
  const A = presFiltered.value.filter(p => p.statut==='A').length
  const R = presFiltered.value.filter(p => p.statut==='R').length
  const total = presFiltered.value.length || 1
  return { P, A, R, tauxPresence: P/total }
})

const groupHeader = computed(() =>
  groupMode.value === 'eleve' ? 'Élève' : (groupMode.value === 'jour' ? 'Jour' : 'Classe')
)

const titleTable = computed(() => {
  const cl = classeId.value ? (classesById.value[classeId.value]?.libelle || classesById.value[classeId.value]?.code) : 'Toutes classes'
  const st = statutFilter.value ? (statutFilter.value==='P'?'Présent':statutFilter.value==='A'?'Absent':'Retard') : 'Tous statuts'
  return `Synthèse ${groupHeader.value.toLowerCase()} — ${cl} — ${start.value} → ${end.value} — ${st}`
})

// Export CSV
function exportCSV(){
  const headers = [groupHeader.value, 'P', 'A', 'R', 'Total', 'TauxPresence']
  const lines = rowsAgg.value.map(r => [
    r.label, r.P, r.A, r.R, r.total, `${(r.tauxPresence*100).toFixed(0)}%`
  ])
  const content = [headers, ...lines]
    .map(row => row.map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))
    .join('\n')
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `rapports-presences-${groupMode.value}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}
</script>
