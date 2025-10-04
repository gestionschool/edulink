<!-- src/pages/pedagogie/DevoirsList.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold">Devoirs</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Création et suivi des devoirs par cours/période
        </p>
      </div>

      <RouterLink
        to="/devoirs/nouveau"
        class="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 dark:border-violet-900"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>
        Nouveau devoir
      </RouterLink>
    </div>

    <!-- Filtres -->
    <DevoirsFilters
      v-model:search="q"
      v-model:classeId="fClasse"
      v-model:coursId="fCours"
      v-model:periodeId="fPeriode"
      v-model:statut="fStatut"
      :classes-options="classesOptions"
      :cours-options="coursOptions"
      :periodes-options="periodesOptions"
      :statuts-options="statutsOptions"
    />

    <!-- Bloc état + table/cards -->
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div v-if="loading" class="p-6">
        <div class="h-4 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800 mb-3"></div>
        <div class="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800 mb-2"></div>
        <div class="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
      </div>

      <div v-else-if="error" class="p-6 text-sm text-red-600 dark:text-red-400">{{ error }}</div>

      <div v-else-if="rows.length === 0" class="p-6 text-sm text-slate-500 dark:text-slate-400">
        Aucun devoir trouvé.
      </div>

      <div v-else class="overflow-x-auto">
        <DevoirsTable :items="rows" :total="total" @remove="onRemove" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useDevoirs } from '@/stores/useDevoirs'
import { useCours } from '@/stores/useCours'
import { useClasses } from '@/stores/useClasses'
import { usePeriodes } from '@/stores/usePeriodes'
import { useTeachers } from '@/stores/useTeachers'

import DevoirsFilters from '@/components/pedagogie/DevoirsFilters.vue'
import DevoirsTable   from '@/components/pedagogie/DevoirsTable.vue'

const devoirs  = useDevoirs()
const cours    = useCours()
const classes  = useClasses()
const periodes = usePeriodes()
const teachers = useTeachers()

onMounted(async () => {
  await Promise.all([
    classes.fetch(),
    periodes.fetch(),
    teachers.fetch(),
    cours.fetch({ _sort: 'code' }),
    devoirs.fetch({ _sort: 'dateRemise', _order: 'desc' }),
  ])
})

// Index rapides
const coursById   = computed(() => Object.fromEntries((cours.items||[]).map(c => [c.id, c])))
const classById   = computed(() => Object.fromEntries((classes.items||[]).map(c => [c.id, c])))
const periodById  = computed(() => Object.fromEntries((periodes.items||[]).map(p => [p.id, p])))
const teacherById = computed(() => Object.fromEntries((teachers.items||[]).map(t => [t.id, t])))

// Filtres contrôlés
const q = ref('')
const fClasse  = ref('')
const fCours   = ref('')
const fPeriode = ref('')
const fStatut  = ref('')

// Options filtres
const classesOptions = computed(() =>
  (classes.items||[]).map(c => ({ value: String(c.id), label: c.libelle || c.label || c.code }))
)
const coursOptions = computed(() =>
  (cours.items||[]).map(c => ({ value: String(c.id), label: `${c.code} • ${c.intitule}` }))
)
const periodesOptions = computed(() =>
  (periodes.items||[]).map(p => ({ value: String(p.id), label: p.label }))
)
const statutsOptions = computed(() => {
  const vals = new Set((devoirs.items||[]).map(d => d.statut).filter(Boolean))
  return Array.from(vals).sort().map(s => ({ value: s, label: s }))
})

// Vue jointe
const rows = computed(() => {
  const term = q.value.trim().toLowerCase()
  return (devoirs.items||[])
    .map(d => {
      const c  = coursById.value[d.coursId]
      const cl = c ? classById.value[c.classeId] : null
      const pr = periodById.value[d.periodeId || (c?.periodeId ?? null)]
      const t  = c ? teacherById.value[c.teacherId] : null

      return {
        ...d,
        _coursLabel:   c ? `${c.code} • ${c.intitule}` : '—',
        _matiere:      c?.matiere || '—',
        _classeLabel:  cl ? (cl.libelle || cl.label || cl.code) : '—',
        _periodeLabel: pr ? pr.label : '—',
        _profLabel:    t ? (t.nom || `${t.prenom ?? ''} ${t.nom ?? ''}`.trim()) : '—',
      }
    })
    .filter(r => {
      if (fClasse.value  && String(coursById.value[r.coursId]?.classeId) !== fClasse.value) return false
      if (fCours.value   && String(r.coursId) !== fCours.value) return false
      if (fPeriode.value && String(r.periodeId || coursById.value[r.coursId]?.periodeId) !== fPeriode.value) return false
      if (fStatut.value  && r.statut !== fStatut.value) return false
      if (!term) return true
      const hay = `${r.titre} ${r._coursLabel} ${r._matiere} ${r._classeLabel} ${r._profLabel} ${r._periodeLabel}`.toLowerCase()
      return hay.includes(term)
    })
})

const total   = computed(() => devoirs.items?.length || 0)
const loading = computed(() => devoirs.loading || cours.loading || classes.loading || periodes.loading || teachers.loading)
const error   = computed(() => devoirs.error   || cours.error   || classes.error   || periodes.error   || teachers.error)

async function onRemove(id){
  if (!confirm('Supprimer ce devoir ?')) return
  await devoirs.removeOne(id)
  await devoirs.fetch({ _sort: 'dateRemise', _order: 'desc' })
}
</script>
