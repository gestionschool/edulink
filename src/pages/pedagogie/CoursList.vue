<!-- src/pages/pedagogie/CoursList.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold">Cours / Matières</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Liaison classe ⇄ matière ⇄ professeur ⇄ période
        </p>
      </div>

      <RouterLink
        to="/cours/nouveau"
        class="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 dark:border-violet-900"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>
        Nouveau cours
      </RouterLink>
    </div>

    <!-- Filtres -->
    <CoursFilters
      v-model:search="q"
      v-model:classeId="fClasse"
      v-model:profId="fProf"
      v-model:periodeId="fPeriode"
      :classes-options="classesOptions"
      :profs-options="profsOptions"
      :periodes-options="periodesOptions"
    />

    <!-- État / Table -->
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div v-if="loading" class="p-6">
        <div class="h-4 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800 mb-3"></div>
        <div class="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800 mb-2"></div>
        <div class="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
      </div>

      <div v-else-if="error" class="p-6 text-sm text-red-600 dark:text-red-400">{{ error }}</div>

      <div v-else-if="rows.length === 0" class="p-6 text-sm text-slate-500 dark:text-slate-400">
        Aucun cours trouvé.
      </div>

      <div v-else class="overflow-x-auto">
        <CoursTable :items="rows" :total="total" @remove="onRemove" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useCoursStore } from '@/stores/useCours'
import { useClassesStore } from '@/stores/useClasses'
import { useTeachersStore } from '@/stores/useTeachers'
import { usePeriodesStore } from '@/stores/usePeriodes'
import CoursFilters from '@/components/pedagogie/CoursFilters.vue'
import CoursTable from '@/components/pedagogie/CoursTable.vue'

const cours = useCoursStore()
const classes = useClassesStore()
const teachers = useTeachersStore()
const periodes = usePeriodesStore()

// Chargement initial (toutes listes nécessaires pour les jointures + options)
onMounted(async () => {
  await Promise.all([
    classes.fetch(),
    teachers.fetch(),
    periodes.fetch(),
    cours.fetch({ _sort: 'code' }),
  ])
})

// Maps rapides
const classById   = computed(() => Object.fromEntries((classes.items||[]).map(c => [c.id, c])))
const teacherById = computed(() => Object.fromEntries((teachers.items||[]).map(t => [t.id, t])))
const periodById  = computed(() => Object.fromEntries((periodes.items||[]).map(p => [p.id, p])))

// Filtres (contrôlés par parent et passés aux composants)
const q = ref('')
const fClasse = ref('')
const fProf = ref('')
const fPeriode = ref('')

// Options (dérivées des listes)
const classesOptions = computed(() =>
  (classes.items||[]).map(c => ({ value: String(c.id), label: c.libelle || c.label || c.code }))
)
const profsOptions = computed(() =>
  (teachers.items||[]).map(t => ({ value: String(t.id), label: t.nom || `${t.prenom ?? ''} ${t.nom ?? ''}`.trim() }))
)
const periodesOptions = computed(() =>
  (periodes.items||[]).map(p => ({ value: String(p.id), label: p.label }))
)

// Vue jointe
const rows = computed(() => {
  const term = q.value.trim().toLowerCase()
  return (cours.items||[])
    .map(c => {
      const cl  = classById.value[c.classeId]
      const tr  = teacherById.value[c.teacherId]
      const pr  = periodById.value[c.periodeId]
      return {
        ...c,
        _classeLabel:  cl ? (cl.libelle || cl.label || cl.code) : '—',
        _profLabel:    tr ? (tr.nom || `${tr.prenom ?? ''} ${tr.nom ?? ''}`.trim()) : '—',
        _periodeLabel: pr ? pr.label : '—',
      }
    })
    .filter(r => {
      if (fClasse.value && String(r.classeId) !== fClasse.value) return false
      if (fProf.value   && String(r.teacherId) !== fProf.value)   return false
      if (fPeriode.value&& String(r.periodeId) !== fPeriode.value)return false
      if (!term) return true
      const hay = `${r.code} ${r.intitule} ${r.matiere} ${r._classeLabel} ${r._profLabel} ${r._periodeLabel}`.toLowerCase()
      return hay.includes(term)
    })
})

const total   = computed(() => cours.items?.length || 0)
const loading = computed(() => cours.loading || classes.loading || teachers.loading || periodes.loading)
const error   = computed(() => cours.error || classes.error || teachers.error || periodes.error)

// Suppression
async function onRemove(id){
  if (!confirm('Supprimer ce cours ?')) return
  await cours.removeOne(id)
  await cours.fetch()
}
</script>
