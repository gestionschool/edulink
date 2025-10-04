<!-- src/pages/pedagogie/NotesSaisie.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold">Saisie des notes</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Choisissez la classe, le cours et la période puis saisissez les notes.
        </p>
      </div>
    </div>

    <!-- Filtres -->
    <NotesFilters
      v-model:classeId="fClasse"
      v-model:coursId="fCours"
      v-model:periodeId="fPeriode"
      v-model:type="fType"
      v-model:coef="fCoef"
      :classes-options="classesOptions"
      :cours-options="coursOptions"
      :periodes-options="periodesOptions"
    />

    <!-- Bloc état -->
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <!-- loading -->
      <div v-if="loading" class="p-6">
        <div class="h-4 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800 mb-3"></div>
        <div class="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800 mb-2"></div>
        <div class="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
      </div>

      <!-- erreurs -->
      <div v-else-if="error" class="p-6 text-sm text-red-600 dark:text-red-400">{{ error }}</div>

      <!-- prerequisites -->
      <div v-else-if="!readyToEnter" class="p-6 text-sm text-slate-600 dark:text-slate-300">
        Sélectionnez <b>classe</b>, <b>cours</b>, <b>période</b>, <b>type</b> et <b>coef</b> pour commencer.
      </div>

      <!-- aucune donnée -->
      <div v-else-if="students.items.length === 0" class="p-6 text-sm text-slate-500 dark:text-slate-400">
        Aucun élève trouvé pour cette classe.
      </div>

      <!-- saisie -->
      <div v-else>
        <NotesEntryTable
          :students="students.items"
          :bareme="20"
          v-model="notesByStudent"
          :extras="extras"
          :saving="saving"
          @save="saveAll"
        />
      </div>
    </div>

    <p v-if="savedOnce" class="text-sm text-green-600 dark:text-green-400">Enregistré ✅</p>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, reactive } from 'vue'
import { useAuthStore }    from '@/stores/useAuth'
import { useClasses } from '@/stores/useClasses'
import { useCours }   from '@/stores/useCours'
import { usePeriodes }from '@/stores/usePeriodes'
import { useStudents }from '@/stores/useStudents'
import { useEvaluations } from '@/stores/useEvaluations'

import NotesFilters     from '@/components/pedagogie/NotesFilters.vue'
import NotesEntryTable  from '@/components/pedagogie/NotesEntryTable.vue'

const auth     = useAuthStore()
const classes  = useClasses()
const cours    = useCours()
const periodes = usePeriodes()
const students = useStudents()
const evals    = useEvaluations()

// sélections
const fClasse  = ref('')
const fCours   = ref('')
const fPeriode = ref('')
const fType    = ref('Devoir')
const fCoef    = ref(1)

// état local
const notesByStudent = ref({}) // { eleveId: note }
const saving = ref(false)
const savedOnce = ref(false)
const error = ref(null)

// chargement de base
onMounted(async () => {
  await Promise.all([
    classes.fetch(),
    periodes.fetch(),
    cours.fetch({ _sort: 'code' }),
  ])
})

// options filtrées
const classesOptions = computed(() =>
  (classes.items||[]).map(c => ({ value: String(c.id), label: c.libelle || c.label || c.code }))
)

const coursOptions = computed(() => {
  const clsId = Number(fClasse.value || 0)
  const role = auth.role
  const userId = auth.user?.id
  return (cours.items||[])
    .filter(c => (clsId ? c.classeId === clsId : true))
    .filter(c => (role === 'PROFESSEUR' && userId ? c.teacherId === userId : true))
    .map(c => ({ value: String(c.id), label: `${c.code} • ${c.intitule}` }))
})

const periodesOptions = computed(() =>
  (periodes.items||[]).map(p => ({ value: String(p.id), label: p.label }))
)

const loading = computed(() =>
  classes.loading || cours.loading || periodes.loading || students.loading || evals.loading
)

// prêt à saisir ?
const readyToEnter = computed(() =>
  !!(fClasse.value && fCours.value && fPeriode.value && fType.value && Number(fCoef.value) > 0)
)

// extras (optionnel — par ex. classe affichée par ligne mobile)
const extras = computed(() => ({}))

// quand la classe change → charger élèves de la classe
watch(fClasse, async (val) => {
  notesByStudent.value = {}
  if (!val) return
  await students.fetch({ classeId: Number(val) }) // json-server: /students?classeId=XX
})

// recharger les évaluations existantes pour (cours, période, type, coef)
watch([fCours, fPeriode, fType, fCoef], async () => {
  notesByStudent.value = {}
  if (!readyToEnter.value) return
  error.value = null
  try {
    // on identifie la matière via le cours choisi
    const c = (cours.items||[]).find(x => String(x.id) === String(fCours.value))
    const matiere = c?.matiere || c?.intitule || ''
    if (!matiere) return

    // Récupère les évaluations existantes correspondantes
    // /evaluations?periodeId=...&matiere=...&type=...&coef=...
    const existing = await evals.fetch({
      periodeId: Number(fPeriode.value),
      matiere,
      type: fType.value,
      coef: Number(fCoef.value),
      _limit: 1000,
    })

    // pré-remplir notes par élève
    const map = {}
    existing.forEach(e => { if (e.eleveId != null) map[e.eleveId] = e.note })
    notesByStudent.value = map
  } catch (e) {
    error.value = e?.message || 'Erreur de chargement des notes'
  }
})

// Enregistrement en masse (upsert par élève)
async function saveAll() {
  if (!readyToEnter.value) return
  saving.value = true; error.value = null
  try {
    const c = (cours.items||[]).find(x => String(x.id) === String(fCours.value))
    const matiere = c?.matiere || c?.intitule || ''
    const periodeId = Number(fPeriode.value)
    const type = fType.value
    const coef = Number(fCoef.value)

    // on récupère les évaluations existantes (id par eleveId) pour éviter N requêtes unitaires
    const existing = await evals.fetch({ periodeId, matiere, type, coef, _limit: 1000 })
    const byEleveId = Object.fromEntries((existing||[]).map(e => [e.eleveId, e]))

    const ops = []
    for (const s of (students.items||[])) {
      const note = notesByStudent.value[s.id]
      if (note === '' || note == null || isNaN(Number(note))) continue

      const payload = {
        eleveId: s.id,
        periodeId,
        matiere,
        type,
        coef,
        note: Number(note),
        obs: '', // champ libre si besoin
      }

      if (byEleveId[s.id]?.id) {
        ops.push(evals.updateOne(byEleveId[s.id].id, payload))
      } else {
        ops.push(evals.createOne(payload))
      }
    }

    await Promise.all(ops)
    savedOnce.value = true
  } catch (e) {
    error.value = e?.message || 'Erreur lors de l’enregistrement'
  } finally {
    saving.value = false
  }
}
</script>
