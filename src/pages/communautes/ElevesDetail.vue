<template>
  <div class="space-y-6">
    <!-- Header / fil d’ariane -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <RouterLink to="/communautes/etudiants" class="hover:underline">Élèves</RouterLink>
          <span>/</span>
          <span class="truncate">{{ fullName || 'Détail' }}</span>
        </div>
        <h1 class="mt-1 truncate text-xl font-semibold">{{ fullName }}</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Matricule : <b>{{ row?.matricule || '—' }}</b>
          <template v-if="classeRow">
            · Classe :
            <RouterLink
              :to="`/classes/detail?id=${classeRow.id}`"
              class="font-medium text-violet-700 hover:underline dark:text-violet-300"
              >{{ classeLabel }}</RouterLink
            >
          </template>
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

        <RouterLink
          v-if="activePeriode"
          :to="`/bulletins/detail?eleveId=${id}&periodeId=${activePeriode.id}`"
          class="rounded-md border border-violet-200 bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 dark:border-violet-900"
        >
          Voir bulletin ({{ activePeriode.label }})
        </RouterLink>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid gap-3 sm:grid-cols-3">
      <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <div class="text-xs text-slate-500 dark:text-slate-400">Moyenne générale</div>
        <div class="mt-1 text-2xl font-semibold">{{ avgGeneral ?? '—' }}</div>
      </div>
      <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <div class="text-xs text-slate-500 dark:text-slate-400">Évaluations (période)</div>
        <div class="mt-1 text-2xl font-semibold">{{ evalsPeriode.length }}</div>
      </div>
      <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <div class="text-xs text-slate-500 dark:text-slate-400">Rang (bulletin)</div>
        <div class="mt-1 text-2xl font-semibold">{{ rank ?? '—' }}</div>
      </div>
    </div>

    <!-- Sélecteur période -->
    <div class="flex flex-wrap items-center gap-2">
      <select v-model.number="periodeId"
              class="w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                     focus:border-violet-500 focus:ring-1 focus:ring-violet-500
                     dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        <option v-for="p in periodes" :key="p.id" :value="p.id">{{ p.label }}</option>
      </select>
      <span class="text-xs text-slate-500 dark:text-slate-400">Filtre la moyenne et la liste des évaluations.</span>
    </div>

    <!-- Moyennes par matière -->
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="border-b border-slate-100 px-4 py-3 text-sm font-medium dark:border-slate-800">
        Moyennes par matière ({{ periodeLabel(periodeId) }})
      </div>
      <div v-if="Object.keys(avgByMatiere).length===0" class="p-6 text-sm text-slate-500 dark:text-slate-400">
        Aucune évaluation pour cette période.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th class="px-4 py-3 font-medium">Matière</th>
              <th class="px-4 py-3 font-medium">Moyenne</th>
              <th class="px-4 py-3 font-medium">Évals</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(m, key) in avgByMatiere" :key="key" class="border-t border-slate-100 dark:border-slate-800">
              <td class="px-4 py-3">{{ key }}</td>
              <td class="px-4 py-3 font-medium">{{ m.moy }}</td>
              <td class="px-4 py-3 text-slate-500 dark:text-slate-400">{{ m.count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Liste des évaluations -->
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm dark:border-slate-800">
        <div class="font-medium">Évaluations ({{ evalsPeriode.length }})</div>
        <input v-model="qEval" type="search" placeholder="Filtrer (matière, type, obs)…"
               class="w-64 max-w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"/>
      </div>

      <div v-if="evalsPeriode.length===0" class="p-6 text-sm text-slate-500 dark:text-slate-400">
        Aucune évaluation pour cette période.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th class="px-4 py-3 font-medium">Matière</th>
              <th class="px-4 py-3 font-medium">Type</th>
              <th class="px-4 py-3 font-medium">Coef</th>
              <th class="px-4 py-3 font-medium">Note</th>
              <th class="px-4 py-3 font-medium">Obs.</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ev in evalsRows" :key="ev.id" class="border-t border-slate-100 dark:border-slate-800">
              <td class="px-4 py-3">{{ ev._matiere }}</td>
              <td class="px-4 py-3">{{ ev.type }}</td>
              <td class="px-4 py-3">{{ ev.coef }}</td>
              <td class="px-4 py-3 font-medium">{{ ev.note }}</td>
              <td class="px-4 py-3 text-slate-500 dark:text-slate-400">{{ ev.obs || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Cours suivis -->
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="border-b border-slate-100 px-4 py-3 text-sm font-medium dark:border-slate-800">
        Cours (classe {{ classeLabel || '—' }})
      </div>
      <div v-if="cours.length===0" class="p-6 text-sm text-slate-500 dark:text-slate-400">Aucun cours.</div>
      <ul v-else class="divide-y divide-slate-100 dark:divide-slate-800">
        <li v-for="c in cours" :key="c.id" class="flex items-center justify-between px-4 py-3 text-sm">
          <div class="min-w-0">
            <div class="truncate font-medium">{{ c.matiere }} — {{ c.intitule || c.code }}</div>
            <div class="text-xs text-slate-500 dark:text-slate-400">
              Prof : {{ teacherName(c.teacherId) }} · {{ periodeLabel(c.periodeId) }}
            </div>
          </div>
          <RouterLink :to="`/cours/detail?id=${c.id}`"
            class="shrink-0 rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >Détails</RouterLink>
        </li>
      </ul>
    </div>

    <!-- Empty / erreur -->
    <div v-if="!loading && !row" class="rounded-xl border border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      Élève introuvable.
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { useStudents } from '@/stores/useStudents'
import { useClasses }   from '@/stores/useClasses'
import { useCours }     from '@/stores/useCours'
import { usePeriodes }  from '@/stores/usePeriodes'
import { useEvaluations } from '@/stores/useEvaluations'
import { useTeachers }  from '@/stores/useTeachers'
// (optionnel) si tu as un store des bulletins (resource: bulletinsMeta)
import { useBulletinsMeta } from '@/stores/useBulletinsMeta' // <- adapte le nom si besoin

const route = useRoute()
const id = ref(Number(route.query.id || 0))
watch(() => route.query.id, v => { id.value = Number(v || 0) })

const studentsS = useStudents()
const classesS  = useClasses()
const coursS    = useCours()
const periodesS = usePeriodes()
const evalsS    = useEvaluations()
const teachersS = useTeachers()
const bulletS   = useBulletinsMeta?.() // évite un crash si non défini

const loading = ref(true)
onMounted(async () => {
  await Promise.all([
    studentsS.fetch(),
    classesS.fetch(),
    coursS.fetch(),
    periodesS.fetch?.(),
    evalsS.fetch?.(),       // si vous avez beaucoup d'items, envisager un fetch({eleveId:id})
    teachersS.fetch?.(),
    bulletS?.fetch?.(),
  ])
  loading.value = false
})

/* ===== Données de base ===== */
const row = computed(() => (studentsS.byId?.[id.value]) || (studentsS.items||[]).find(e => e.id === id.value) || null)
const fullName = computed(() => row.value?.nom || '—')
const classeRow = computed(() => row.value ? (classesS.byId?.[row.value.classeId] || (classesS.items||[]).find(c => c.id === row.value.classeId) || null) : null)
const classeLabel = computed(() => classeRow.value ? (classeRow.value.libelle || classeRow.value.label || classeRow.value.code) : '')

const periodes = computed(() => periodesS.items || [])
const activePeriode = computed(() => (periodes.value||[]).find(p => p.active) || null)
const periodeId = ref(activePeriode.value?.id || periodes.value?.[0]?.id || null)
watch(activePeriode, (p) => { if (!periodeId.value && p) periodeId.value = p.id })

const cours = computed(() => {
  if (!classeRow.value) return []
  return (coursS.items||[]).filter(c => Number(c.classeId) === Number(classeRow.value.id))
})

const evalsAll = computed(() => (evalsS.items || []).filter(ev => Number(ev.eleveId) === id.value))
const evalsPeriode = computed(() => evalsAll.value.filter(ev => Number(ev.periodeId) === Number(periodeId.value)))

/* ===== Mappings ===== */
const coursById = computed(() => Object.fromEntries((coursS.items||[]).map(c => [c.id, c])))
const teachersById = computed(() => Object.fromEntries((teachersS.items||[]).map(t => [t.id, t])))
function teacherName(tid){
  const t = teachersById.value[tid]; if (!t) return '—'
  return t.prenom ? `${t.prenom} ${t.nom}` : t.nom
}
function periodeLabel(pid){
  const p = (periodes.value||[]).find(x => x.id === pid)
  return p?.label || '—'
}

/* ===== Enrichissement des évaluations ===== */
const evalsEnriched = computed(() => evalsPeriode.value.map(ev => {
  const c = ev.coursId ? coursById.value[ev.coursId] : null
  return {
    ...ev,
    _matiere: c?.matiere || ev.matiere || '—'
  }
}))

/* ===== Moyennes ===== */
function moyWeighted(list){
  const num = list.reduce((s, e) => s + (Number(e.note) * Number(e.coef || 1)), 0)
  const den = list.reduce((s, e) => s + Number(e.coef || 1), 0)
  if (!den) return null
  return Math.round((num/den) * 100) / 100
}

const avgGeneral = computed(() => moyWeighted(evalsPeriode.value))
const avgByMatiere = computed(() => {
  const map = {}
  evalsEnriched.value.forEach(e => {
    const m = e._matiere || '—'
    if (!map[m]) map[m] = { items: [] }
    map[m].items.push(e)
  })
  // calcule moyenne + count
  return Object.fromEntries(Object.entries(map).map(([k, v]) => {
    const moy = moyWeighted(v.items)
    return [k, { moy, count: v.items.length }]
  }))
})

/* ===== Rang via bulletinsMeta (si dispo) ===== */
const rank = computed(() => {
  const bs = bulletS?.items || []
  const b = bs.find(b => Number(b.eleveId) === id.value && Number(b.periodeId) === Number(periodeId.value))
  return b?.rank ?? null
})

/* ===== Filtre évaluations ===== */
const qEval = ref('')
const evalsRows = computed(() => {
  const t = qEval.value.trim().toLowerCase()
  if (!t) return evalsEnriched.value
  return evalsEnriched.value.filter(e => `${e._matiere} ${e.type} ${e.obs||''}`.toLowerCase().includes(t))
})
</script>
