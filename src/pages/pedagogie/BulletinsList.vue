<!-- src/pages/pedagogie/BulletinsList.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold">Bulletins</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Sélectionnez la classe et la période. Les moyennes et rangs sont calculés automatiquement.
        </p>
      </div>
      <div class="flex gap-2">
        <RouterLink
          to="/bulletin/recherche"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.5 21.5 20l-6-6zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          Recherche
        </RouterLink>
      </div>
    </div>

    <!-- Filtres -->
    <BulletinFilters
      v-model:classeId="fClasse"
      v-model:periodeId="fPeriode"
      :classes-options="classesOptions"
      :periodes-options="periodesOptions"
    />

    <!-- Bloc état -->
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div v-if="loading" class="p-6">
        <div class="h-4 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800 mb-3"></div>
        <div class="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800 mb-2"></div>
        <div class="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
      </div>

      <div v-else-if="error" class="p-6 text-sm text-red-600 dark:text-red-400">{{ error }}</div>

      <div v-else-if="!fClasse || !fPeriode" class="p-6 text-sm text-slate-600 dark:text-slate-300">
        Choisissez une <b>classe</b> et une <b>période</b> pour afficher les bulletins.
      </div>

      <div v-else-if="students.items.length === 0" class="p-6 text-sm text-slate-500 dark:text-slate-400">
        Aucun élève dans cette classe.
      </div>

      <div v-else>
        <BulletinsTable
          :rows="rows"
          :periode-label="periodeLabel"
          :periode-id="fPeriode"
          :saving="saving"
          @save="saveAll"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useClasses } from '@/stores/useClasses'
import { usePeriodes } from '@/stores/usePeriodes'
import { useStudents } from '@/stores/useStudents'
import { useEvaluations } from '@/stores/useEvaluations'
import { useBulletinsMeta } from '@/stores/useBulletinsMeta'

import BulletinFilters from '@/components/pedagogie/BulletinFilters.vue'
import BulletinsTable  from '@/components/pedagogie/BulletinsTable.vue'

const classes   = useClasses()
const periodes  = usePeriodes()
const students  = useStudents()
const evals     = useEvaluations()
const metas     = useBulletinsMeta()

const fClasse  = ref('')
const fPeriode = ref('')
const error = ref(null)
const saving = ref(false)

// chargement base
onMounted(async () => {
  await Promise.all([ classes.fetch(), periodes.fetch() ])
})

// options sélecteurs
const classesOptions = computed(() =>
  (classes.items||[]).map(c => ({ value: String(c.id), label: c.libelle || c.label || c.code }))
)
const periodesOptions = computed(() =>
  (periodes.items||[]).map(p => ({ value: String(p.id), label: p.label }))
)
const periodeLabel = computed(() =>
  (periodes.items||[]).find(p => String(p.id) === String(fPeriode.value))?.label || ''
)

const loading = computed(() =>
  classes.loading || periodes.loading || students.loading || evals.loading || metas.loading
)

// charger élèves + données quand filtres changent
watch([fClasse, fPeriode], async ([cls, per]) => {
  error.value = null
  if (!cls) return
  await students.fetch({ classeId: Number(cls) }) // /students?classeId=...
  if (!per) return

  // charge évaluations + metas de la période + classe
  // (on peut limiter via _limit élevé pour json-server)
  await Promise.all([
    evals.fetch({ periodeId: Number(per), _limit: 10000 }),
    metas.fetch({ periodeId: Number(per), _limit: 10000 }),
  ])
}, { immediate: true })

// calculs
function moyParMatiere(evalsArr) {
  // { matiere: { sum: , coef: } } -> moyenne par matière
  const acc = {}
  for (const e of (evalsArr||[])) {
    const m = e.matiere || '—'
    const coef = Number(e.coef || 1)
    const note = Number(e.note || 0)
    if (!acc[m]) acc[m] = { sum: 0, coef: 0 }
    acc[m].sum  += note * coef
    acc[m].coef += coef
  }
  const matieres = Object.keys(acc)
  if (matieres.length === 0) return null
  const moyennes = matieres.map(m => (acc[m].coef > 0 ? acc[m].sum / acc[m].coef : 0))
  // moyenne générale = moyenne des moyennes par matière (pondération égale par matière)
  return moyennes.reduce((a,b)=>a+b,0) / moyennes.length
}

const rows = computed(() => {
  if (!fClasse.value || !fPeriode.value) return []
  const per = Number(fPeriode.value)
  const list = []

  // map meta existantes: (eleveId -> meta)
  const metaByEleve = Object.fromEntries((metas.items||[]).filter(m => Number(m.periodeId)===per).map(m => [m.eleveId, m]))

  for (const s of (students.items||[])) {
    const eForStu = (evals.items||[]).filter(e => e.eleveId === s.id && Number(e.periodeId) === per)
    const moyenne = moyParMatiere(eForStu)
    list.push({
      eleveId: s.id,
      nom: s.nom,
      classeLabel: classes.byId?.[Number(fClasse.value)]?.libelle || classes.byId?.[Number(fClasse.value)]?.label || '',
      moyenne,
      rank: metaByEleve[s.id]?.rank ?? null,
      observation: metaByEleve[s.id]?.observationsGenerales ?? '',
    })
  }

  // calcul rang (competition ranking: 1,2,2,4…)
  const sorted = [...list].sort((a,b) => (b.moyenne ?? -1) - (a.moyenne ?? -1))
  let lastM = null, lastRank = 0, seen = 0
  const rankMap = new Map()
  for (const r of sorted) {
    seen++
    if (r.moyenne == null) { rankMap.set(r.eleveId, null); continue }
    if (lastM == null || r.moyenne < lastM) { lastRank = seen; lastM = r.moyenne }
    rankMap.set(r.eleveId, lastRank)
  }
  list.forEach(r => r.rank = rankMap.get(r.eleveId) ?? r.rank)

  return list
})

// sauvegarde des observations + rang (recalcule le rang actuel)
async function saveAll(localObsMap) {
  if (!fPeriode.value) return
  try {
    saving.value = true; error.value = null
    const per = Number(fPeriode.value)

    // récupère l’état existant pour savoir si update/create
    const existing = await metas.fetch({ periodeId: per, _limit: 10000 })
    const byEleveId = Object.fromEntries((existing||[]).map(m => [m.eleveId, m]))

    const ops = []
    for (const r of rows.value) {
      const payload = {
        eleveId: r.eleveId,
        periodeId: per,
        observationsGenerales: localObsMap?.[r.eleveId] ?? r.observation ?? '',
        rank: r.rank ?? null,
      }
      if (byEleveId[r.eleveId]?.id) ops.push(metas.updateOne(byEleveId[r.eleveId].id, payload))
      else ops.push(metas.createOne(payload))
    }
    await Promise.all(ops)
  } catch (e) {
    error.value = e?.message || 'Erreur lors de l’enregistrement'
  } finally {
    saving.value = false
  }
}
</script>
