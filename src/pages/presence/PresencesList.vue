<!-- src/pages/presence/PresencesList.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold">Présences — Liste</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Filtre par période, classe, cours et statut. Export CSV disponible.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
          @click="printPage"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 9V2h12v7h2a2 2 0 0 1 2 2v6h-4v5H8v-5H4v-6a2 2 0 0 1 2-2h0zm2-5v5h8V4H8zm2 13v3h4v-3h-4z"/></svg>
          Imprimer
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 dark:border-violet-900"
          @click="exportCsv"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5 20h14v-2H5v2zM12 2l4 4h-3v6h-2V6H8l4-4z"/></svg>
          Export CSV
        </button>
      </div>
    </div>

    <!-- Filtres -->
    <div class="grid gap-3 md:grid-cols-5">
      <input v-model="dateFrom" type="date" class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100" />
      <input v-model="dateTo"   type="date" class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100" />
      <select v-model.number="classeId" class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        <option value="">— Classe —</option>
        <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.libelle || c.label || c.code }}</option>
      </select>
      <select v-model.number="coursId" class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        <option value="">— Cours —</option>
        <option v-for="co in coursFiltrés" :key="co.id" :value="co.id">{{ co.matiere }} — {{ co.intitule || co.code }}</option>
      </select>
      <select v-model="statut" class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        <option value="">Tous statuts</option>
        <option value="P">Présent</option>
        <option value="A">Absent</option>
        <option value="R">Retard</option>
      </select>
    </div>

    <!-- Etat -->
    <div v-if="pres.loading" class="rounded-xl border border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      Chargement…
    </div>
    <div v-else-if="rows.length === 0" class="rounded-xl border border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      Aucune présence sur cette période.
    </div>

    <!-- Mobile cards -->
    <div v-else class="md:hidden divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div v-for="r in rows" :key="r.id" class="p-3">
        <div class="flex items-center justify-between">
          <div class="text-sm font-medium">{{ r.eleveName }}</div>
          <span :class="badgeClass(r.statut)">{{ statutLabel(r.statut) }}</span>
        </div>
        <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {{ r.date }} — {{ r.classeLabel }} — {{ r.coursLabel }}
        </div>
        <div class="mt-2 flex justify-end">
          <button class="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20" @click="remove(r.id)">
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Table desktop -->
    <div v-if="rows.length" class="hidden md:block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th class="px-4 py-3 font-medium">Date</th>
              <th class="px-4 py-3 font-medium">Classe</th>
              <th class="px-4 py-3 font-medium">Cours</th>
              <th class="px-4 py-3 font-medium">Élève</th>
              <th class="px-4 py-3 font-medium">Statut</th>
              <th class="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rows" :key="r.id" class="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60">
              <td class="px-4 py-3">{{ r.date }}</td>
              <td class="px-4 py-3">{{ r.classeLabel }}</td>
              <td class="px-4 py-3">{{ r.coursLabel }}</td>
              <td class="px-4 py-3">{{ r.eleveName }}</td>
              <td class="px-4 py-3">
                <span :class="badgeClass(r.statut)">{{ statutLabel(r.statut) }}</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex justify-end">
                  <button class="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20" @click="remove(r.id)">
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="border-t border-slate-100 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          {{ rows.length }} enregistrements
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { usePresencesStore } from '@/stores/usePresences'
import { useClassesStore } from '@/stores/useClasses'
import { useCoursStore } from '@/stores/useCours'
import { useStudentsStore } from '@/stores/useStudents'

const pres = usePresencesStore()
const classesStore = useClassesStore()
const coursStore   = useCoursStore()
const studentsStore= useStudentsStore()

// filtres
const today = new Date().toISOString().slice(0,10)
const dateFrom = ref(today)
const dateTo   = ref(today)
const classeId = ref('')
const coursId  = ref('')
const statut   = ref('')

// chargement initial des référentiels
onMounted(async () => {
  await Promise.all([
    classesStore.fetch(),
    coursStore.fetch(),
    studentsStore.fetch(),
  ])
  await fetchPresences()
})

// refresh quand filtres changent
watch([dateFrom, dateTo, classeId, coursId, statut], fetchPresences)

function fetchPresences(){
  const params = {
    ...(dateFrom.value ? { date_gte: dateFrom.value } : {}),
    ...(dateTo.value   ? { date_lte: dateTo.value }   : {}),
    ...(classeId.value ? { classeId: Number(classeId.value) } : {}),
    ...(coursId.value  ? { coursId:  Number(coursId.value)  } : {}),
    ...(statut.value   ? { statut:   statut.value } : {}),
    _sort: 'date',
    _order: 'desc',
  }
  return pres.fetch(params)
}

const classes = computed(() => classesStore.items || [])
const coursFiltrés = computed(() => {
  const list = (coursStore.items || [])
  return classeId.value ? list.filter(c => Number(c.classeId) === Number(classeId.value)) : list
})

const classById   = computed(() => classesStore.byId || {})
const coursById   = computed(() => coursStore.byId || {})
const studentById = computed(() => studentsStore.byId || {})

// lignes jointes
const rows = computed(() =>
  (pres.items || []).map(p => {
    const c = classById.value[p.classeId]
    const co= coursById.value[p.coursId]
    const s = studentById.value[p.eleveId]
    return {
      ...p,
      classeLabel: c ? (c.libelle || c.label || c.code) : '',
      coursLabel:  co ? `${co.matiere} — ${co.intitule || co.code}` : '',
      eleveName:   s ? (s.nom || s.name) : `#${p.eleveId}`,
    }
  })
)

// statut badge
function badgeClass(v){
  const base = 'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium'
  if (v === 'P') return `${base} bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200`
  if (v === 'A') return `${base} bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200`
  if (v === 'R') return `${base} bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200`
  return `${base} bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200`
}
const statutLabel = (v)=> v==='P'?'Présent':v==='A'?'Absent':v==='R'?'Retard':'—'

// actions
async function remove(id){
  if (!confirm('Supprimer cette présence ?')) return
  await pres.removeOne(id)
  await fetchPresences()
}
function printPage(){ window.print() }
function exportCsv(){
  const header = ['id','date','classe','cours','eleve','statut']
  const lines = rows.value.map(r => [
    r.id,
    r.date,
    `"${r.classeLabel}"`,
    `"${r.coursLabel}"`,
    `"${r.eleveName}"`,
    r.statut,
  ].join(','))
  const csv = [header.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'presences.csv'; a.click()
  URL.revokeObjectURL(url)
}
</script>
