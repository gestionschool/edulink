<!-- src/pages/rapports/AcadRapports.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold">Rapports académiques</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Moyennes pondérées par classe / matière et période.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50
                 dark:border-slate-800 dark:bg-slate-900"
          @click="window.print()"
        >
          Imprimer
        </button>
        <button
          type="button"
          class="rounded-md border border-violet-200 bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700
                 dark:border-violet-900"
          @click="exportCSV()"
          :disabled="rowsAgg.length === 0"
        >
          Export CSV
        </button>
      </div>
    </div>

    <!-- Filtres -->
    <div class="grid gap-3 md:grid-cols-4">
      <select
        v-model="viewMode"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
               dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      >
        <option value="classe">Vue par classe</option>
        <option value="matiere">Vue par matière</option>
      </select>

      <select
        v-model.number="classeId"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
               dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        :disabled="viewMode==='classe' && !classes.length"
      >
        <option value="">— Toutes classes —</option>
        <option v-for="c in classes" :key="c.id" :value="c.id">
          {{ c.libelle || c.label || c.code }}
        </option>
      </select>

      <select
        v-model.number="periodeId"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
               dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      >
        <option value="">— Toutes périodes —</option>
        <option v-for="p in periodes" :key="p.id" :value="p.id">
          {{ p.label }}
        </option>
      </select>

      <select
        v-model="matiere"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
               dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        :disabled="viewMode==='classe' && !matieres.length"
      >
        <option value="">— Toutes matières —</option>
        <option v-for="m in matieres" :key="m" :value="m">{{ m }}</option>
      </select>
    </div>

    <!-- État -->
    <div v-if="loadingAny" class="rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-800">
      Chargement…
    </div>
    <div v-else-if="errorAny" class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
      {{ errorAny }}
    </div>
    <div v-else-if="rowsAgg.length === 0" class="rounded-xl border border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      Aucun résultat pour ces filtres.
    </div>

    <!-- KPI rapides -->
    <div v-else class="grid gap-3 sm:grid-cols-3">
      <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <div class="text-xs text-slate-500 dark:text-slate-400">Moyenne globale</div>
        <div class="mt-1 text-2xl font-semibold">{{ kpi.moyenneGlobale.toFixed(2) }}/20</div>
      </div>
      <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <div class="text-xs text-slate-500 dark:text-slate-400">Évaluations prises en compte</div>
        <div class="mt-1 text-2xl font-semibold">{{ kpi.nbEval }}</div>
      </div>
      <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <div class="text-xs text-slate-500 dark:text-slate-400">Taux de réussite (≥10)</div>
        <div class="mt-1 text-2xl font-semibold">{{ (kpi.tauxReussite*100).toFixed(0) }}%</div>
      </div>
    </div>

    <!-- Tableau agrégé -->
    <div v-if="rowsAgg.length" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm dark:border-slate-800">
        <span class="text-slate-600 dark:text-slate-300">
          {{ titleTable }}
        </span>
        <span class="text-slate-500 dark:text-slate-400">
          {{ rowsAgg.length }} ligne(s)
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th class="px-4 py-3 font-medium sticky left-0 bg-slate-50 dark:bg-slate-800">
                {{ viewMode==='classe' ? 'Classe' : 'Matière' }}
              </th>
              <th class="px-4 py-3 font-medium">Moyenne</th>
              <th class="px-4 py-3 font-medium">Évals</th>
              <th class="px-4 py-3 font-medium">Taux ≥10</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rowsAgg" :key="r.key" class="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60">
              <td class="px-4 py-3 font-medium sticky left-0 bg-white dark:bg-slate-900">
                {{ r.label }}
              </td>
              <td class="px-4 py-3">{{ r.moyenne.toFixed(2) }}</td>
              <td class="px-4 py-3">{{ r.nbEval }}</td>
              <td class="px-4 py-3">{{ (r.tauxReussite*100).toFixed(0) }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

// Stores (déjà créés avec makeCrudStore)
import { useEvaluations } from '@/stores/useEvaluations'
import { useClasses }     from '@/stores/useClasses'
import { useCours }       from '@/stores/useCours'
import { usePeriodes }    from '@/stores/usePeriodes'
import { useStudents }    from '@/stores/useStudents'

// Instances
const evalS    = useEvaluations()
const classesS = useClasses()
const coursS   = useCours()
const periodesS= usePeriodes()
const studsS   = useStudents()

// Filtres
const viewMode  = ref('classe') // 'classe' | 'matiere'
const classeId  = ref('')
const periodeId = ref('')
const matiere   = ref('')

// Chargement initial
onMounted(async () => {
  await Promise.all([
    classesS.fetch(),
    coursS.fetch(),
    periodesS.fetch(),
    studsS.fetch(),
    evalS.fetch(),
  ])
})

// Lookups
const classes  = computed(() => classesS.items || [])
const periodes = computed(() => periodesS.items || [])
const coursById = computed(() => Object.fromEntries((coursS.items||[]).map(c => [c.id, c])))
const studsById = computed(() => Object.fromEntries((studsS.items||[]).map(s => [s.id, s])))

// Matieres options (cours ∪ evaluations)
const matieres = computed(() => {
  const a = new Set()
  ;(coursS.items||[]).forEach(c => c.matiere && a.add(c.matiere))
  ;(evalS.items||[]).forEach(e => e.matiere && a.add(e.matiere))
  return Array.from(a).sort()
})

// Évaluations "jointes" (classeId & matiere fiabilisées)
const evalJoined = computed(() => {
  return (evalS.items || []).map(e => {
    const co = e.coursId ? coursById.value[e.coursId] : null
    const st = studsById.value[e.eleveId]
    return {
      ...e,
      classeId: st?.classeId ?? co?.classeId ?? null,
      matiere:  e.matiere || co?.matiere || '',
    }
  })
})

// Filtrage principal
const evalFiltered = computed(() => {
  return evalJoined.value.filter(e => {
    if (classeId.value && Number(e.classeId) !== Number(classeId.value)) return false
    if (periodeId.value && Number(e.periodeId) !== Number(periodeId.value)) return false
    if (matiere.value && e.matiere !== matiere.value) return false
    return true
  })
})

// Agrégation
function aggregate(rows, groupKey, labelFn) {
  const map = new Map()
  rows.forEach(r => {
    const key = groupKey(r)
    if (!key) return
    const bucket = map.get(key) || { key, label: labelFn(r), sumW: 0, sumWN: 0, nbEval: 0, pass: 0 }
    const coef = Number(r.coef || 1)
    const note = Number(r.note || 0)
    bucket.sumW  += coef
    bucket.sumWN += coef * note
    bucket.nbEval++
    if (note >= 10) bucket.pass++
    map.set(key, bucket)
  })
  const arr = Array.from(map.values()).map(b => ({
    ...b,
    moyenne: b.sumW ? b.sumWN / b.sumW : 0,
    tauxReussite: b.nbEval ? b.pass / b.nbEval : 0,
  }))
  // tri décroissant par moyenne
  arr.sort((a,b) => b.moyenne - a.moyenne)
  return arr
}

const rowsAgg = computed(() => {
  if (viewMode.value === 'classe') {
    // Grouper par classe (label = libellé classe), matiere/period peuvent filtrer
    return aggregate(
      evalFiltered.value,
      (r) => r.classeId,
      (r) => {
        const c = classesS.byId?.[r.classeId] || classes.find(x => x.id === r.classeId)
        return c ? (c.libelle || c.label || c.code) : `Classe #${r.classeId ?? '—'}`
      }
    )
  }
  // Vue matière : on peut en plus restreindre à une classe précise via le filtre classeId
  return aggregate(
    evalFiltered.value,
    (r) => r.matiere || '(Sans matière)',
    (r) => r.matiere || '(Sans matière)'
  )
})

// KPI globaux
const kpi = computed(() => {
  const totalW  = rowsAgg.value.reduce((s,r) => s + r.sumW, 0)
  const totalWN = rowsAgg.value.reduce((s,r) => s + r.sumWN, 0)
  const nbEval  = rowsAgg.value.reduce((s,r) => s + r.nbEval, 0)
  const pass    = rowsAgg.value.reduce((s,r) => s + Math.round(r.tauxReussite * r.nbEval), 0)
  return {
    moyenneGlobale: totalW ? (totalWN / totalW) : 0,
    nbEval,
    tauxReussite: nbEval ? (pass / nbEval) : 0,
  }
})

const loadingAny = computed(() =>
  classesS.loading || coursS.loading || periodesS.loading || studsS.loading || evalS.loading
)
const errorAny = computed(() =>
  classesS.error?.message || coursS.error?.message || periodesS.error?.message || studsS.error?.message || evalS.error?.message || null
)

const titleTable = computed(() => {
  const p = periodeId.value ? (periodes.find(x => x.id === Number(periodeId.value))?.label || '') : 'Toutes périodes'
  if (viewMode.value === 'classe') {
    return `Moyennes par classe — ${p}${matiere.value ? ' — Matière: ' + matiere.value : ''}`
  }
  // matière
  const cl = classeId.value ? (classes.find(c => c.id === Number(classeId.value))?.libelle || '') : 'Toutes classes'
  return `Moyennes par matière — ${p} — ${cl}`
})

// Export CSV (simple)
function exportCSV() {
  const headers = ['Groupe', 'Moyenne', 'Evals', 'Taux>=10']
  const lines = rowsAgg.value.map(r => [
    r.label,
    r.moyenne.toFixed(2),
    String(r.nbEval),
    (r.tauxReussite * 100).toFixed(0) + '%'
  ])
  const content = [headers, ...lines].map(row => row.map(s => `"${String(s).replace(/"/g,'""')}"`).join(',')).join('\n')
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  const base = viewMode.value === 'classe' ? 'par-classe' : 'par-matiere'
  a.download = `rapports-acad-${base}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}
</script>
