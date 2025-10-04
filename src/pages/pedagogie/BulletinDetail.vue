<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
      <div>
        <h1 class="text-xl font-semibold">Bulletin – {{ eleveName || 'Élève' }}</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          {{ classeLabel || 'Classe —' }} • {{ periodeLabel || 'Période —' }}
        </p>
      </div>
      <div class="flex gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 print:hidden"
          @click="goBack"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11 19l-7-7 7-7 1.41 1.41L7.83 11H20v2H7.83l4.58 4.59L11 19z"/></svg>
          Retour
        </button>
        <!-- Export PDF (ouvre la boîte d'impression => PDF) -->
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-600 px-3 py-2 text-sm font-medium text-white
                shadow-sm hover:bg-violet-700 dark:border-violet-900 print:hidden"
          @click="onExportPDF"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V8h4.5"/><path d="M8 10h8v2H8zm0 4h8v2H8z"/></svg>
          Exporter PDF
        </button>
      </div>
    </div>

    <!-- En-tête pour impression -->
    <div class="only-print mb-3 hidden">
      <div class="text-center">
        <div class="text-lg font-semibold">Établissement</div>
        <div class="text-sm text-slate-600">Bulletin scolaire – {{ periodeLabel || '—' }}</div>
        <div class="mt-1 text-sm">{{ eleveName }} • {{ classeLabel }}</div>
      </div>
      <hr class="my-3 border-slate-300" />
    </div>


    <!-- Info cards -->
    <div class="grid gap-3 sm:grid-cols-3">
      <div class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div class="text-xs text-slate-500 dark:text-slate-400">Moyenne générale</div>
        <div class="mt-1 text-2xl font-semibold">{{ formatNum(moyenneGenerale) }}</div>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div class="text-xs text-slate-500 dark:text-slate-400">Rang</div>
        <div class="mt-1 text-2xl font-semibold">{{ rank ?? '—' }}</div>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div class="text-xs text-slate-500 dark:text-slate-400">Période</div>
        <div class="mt-1 text-base font-medium">{{ periodeLabel || '—' }}</div>
      </div>
    </div>

    <!-- Tableau matières -->
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div v-if="loading" class="p-6">
        <div class="h-4 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800 mb-3"></div>
        <div class="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800 mb-2"></div>
        <div class="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
      </div>
      <div v-else-if="error" class="p-6 text-sm text-red-600 dark:text-red-400">{{ error }}</div>
      <div v-else-if="rows.length === 0" class="p-6 text-sm text-slate-500 dark:text-slate-400">
        Aucune évaluation trouvée pour cette période.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th class="px-4 py-3 font-medium">Matière</th>
              <th class="px-4 py-3 font-medium">Détails (type • note × coef)</th>
              <th class="px-4 py-3 font-medium">Moy. matière</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in rows"
              :key="r.matiere"
              class="border-t border-slate-100 dark:border-slate-800"
            >
              <td class="px-4 py-3 font-medium">{{ r.matiere }}</td>
              <td class="px-4 py-3">
                <ul class="space-y-1">
                  <li v-for="(d,i) in r.details" :key="i" class="text-slate-700 dark:text-slate-200">
                    <span class="inline-flex items-center gap-1 rounded border border-slate-200 px-2 py-0.5 text-xs dark:border-slate-700">
                      {{ d.type || '—' }}
                    </span>
                    <span class="ml-2 text-xs text-slate-500 dark:text-slate-400">
                      {{ formatNum(d.note) }} × {{ d.coef || 1 }}
                      <span v-if="d.obs" class="ml-2 italic opacity-75">({{ d.obs }})</span>
                    </span>
                  </li>
                </ul>
              </td>
              <td class="px-4 py-3 font-semibold">{{ formatNum(r.moyenne) }}</td>
            </tr>
          </tbody>
          <tfoot class="bg-slate-50 dark:bg-slate-800">
            <tr>
              <td class="px-4 py-3 font-medium">Moyenne générale</td>
              <td></td>
              <td class="px-4 py-3 font-semibold">{{ formatNum(moyenneGenerale) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Observations -->
    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:shadow-none">
      <label class="mb-2 block text-sm font-medium">Observations générales</label>
      <textarea
        v-model="obs"
        rows="4"
        class="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm
               focus:border-violet-500 focus:ring-1 focus:ring-violet-500
               dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        placeholder="Appréciations générales à l’attention de l’élève et des parents…"
      ></textarea>

      <div class="mt-3 flex items-center justify-end gap-2 print:hidden">
        <button
          class="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 disabled:opacity-60 dark:border-violet-900"
          :disabled="saving"
          @click="saveMeta"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5 12l4 4L19 6l-2-2-8 8-2-2-2 2z"/></svg>
          {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Stores
import { useStudentsStore }   from '@/stores/useStudents'
import { useClassesStore }    from '@/stores/useClasses'
import { usePeriodesStore }   from '@/stores/usePeriodes'
import { useEvaluationsStore }from '@/stores/useEvaluations'
import { useBulletinsMetaStore } from '@/stores/useBulletinsMeta'

const route = useRoute()
const router = useRouter()

const students = useStudentsStore()
const classes  = useClassesStore()
const periodes = usePeriodesStore()
const evals    = useEvaluationsStore()
const metas    = useBulletinsMetaStore()

const eleveId  = ref(route.query.eleveId ? Number(route.query.eleveId) : null)
const periodeId= ref(route.query.periodeId ? Number(route.query.periodeId) : null)

const error  = ref(null)
const saving = ref(false)
const obs    = ref('')     // observations générales (éditable)
const rank   = ref(null)   // rang (affiché, calculé côté liste — ici on l’affiche tel que stocké si présent)

// Chargement de base
onMounted(async () => {
  try {
    await Promise.all([ classes.fetch(), periodes.fetch() ])
  } catch (e) {
    error.value = e?.message || 'Erreur de chargement'
  }
})

// (Re)charge l’élève + ses évaluations + meta quand params changent
watch([eleveId, periodeId], async ([eid, pid]) => {
  if (!eid || !pid) return
  error.value = null
  try {
    // élève (si pas déjà en cache)
    await students.getOne(eid).catch(()=>{})
    // évaluations ciblées
    await evals.fetch({ eleveId: eid, periodeId: pid, _limit: 10000 })
    // meta (obs/rank)
    await metas.fetch({ eleveId: eid, periodeId: pid, _limit: 1 })
    const meta = metas.items?.find(m => m.eleveId === eid && m.periodeId === pid)
    obs.value  = meta?.observationsGenerales || ''
    rank.value = meta?.rank ?? null
  } catch (e) {
    error.value = e?.message || 'Impossible de charger les données'
  }
}, { immediate: true })

// Infos header
const eleve = computed(() => students.get?.(eleveId.value) || null)
const eleveName = computed(() => eleve.value?.nom || '—')
const classeLabel = computed(() => {
  const c = classes.byId?.[eleve.value?.classeId]
  return c?.libelle || c?.label || c?.code || ''
})
const periodeLabel = computed(() =>
  (periodes.items||[]).find(p => p.id === periodeId.value)?.label || ''
)

const loading = computed(() =>
  classes.loading || periodes.loading || students.loading || evals.loading || metas.loading
)

// Grouping & moyennes
function groupByMatiere(list){
  const map = new Map()
  for (const e of (list || [])) {
    const m = e.matiere || '—'
    if (!map.has(m)) map.set(m, [])
    map.get(m).push({
      type: e.type,
      note: Number(e.note || 0),
      coef: Number(e.coef || 1),
      obs: e.obs || '',
    })
  }
  return Array.from(map.entries()).map(([matiere, details]) => {
    const { sum, coef } = details.reduce((a,d)=>({ sum: a.sum + d.note*d.coef, coef: a.coef + d.coef }), { sum:0, coef:0 })
    const moyenne = coef > 0 ? sum/coef : null
    return { matiere, details, moyenne }
  }).sort((a,b) => (a.matiere||'').localeCompare(b.matiere||''))
}

const rows = computed(() => {
  if (!eleveId.value || !periodeId.value) return []
  const data = (evals.items||[]).filter(e => e.eleveId === eleveId.value && e.periodeId === periodeId.value)
  return groupByMatiere(data)
})

const moyenneGenerale = computed(() => {
  const mats = rows.value.filter(r => r.moyenne != null)
  if (mats.length === 0) return null
  const sum = mats.reduce((a,r)=>a + r.moyenne, 0)
  return sum / mats.length
})

// Actions
async function saveMeta(){
  if (!eleveId.value || !periodeId.value) return
  try {
    saving.value = true; error.value = null
    // existe ?
    const existing = metas.items?.find(m => m.eleveId === eleveId.value && m.periodeId === periodeId.value)
    const payload = {
      eleveId: eleveId.value,
      periodeId: periodeId.value,
      observationsGenerales: obs.value,
      // on ne recalcule pas ici le rang (il est calculé côté liste), mais on le conserve si existant
      rank: existing?.rank ?? rank.value ?? null,
    }
    if (existing?.id) await metas.updateOne(existing.id, payload)
    else await metas.createOne(payload)
  } catch (e) {
    error.value = e?.message || 'Erreur à l’enregistrement'
  } finally {
    saving.value = false
  }
}

function goBack(){
  // revient vers la liste des bulletins (garde le contexte si possible)
  if (history.length > 1) router.back()
  else router.replace('/bulletins')
}

function onExportPDF(){
  window.print()
}

// Utils
function formatNum(n) {
  if (n == null || Number.isNaN(n)) return '—'
  return Number(n).toFixed(2)
}

// Sync si l’URL change (navigations internes)
watchEffect(() => {
  if (route.query.eleveId) eleveId.value = Number(route.query.eleveId)
  if (route.query.periodeId) periodeId.value = Number(route.query.periodeId)
})
</script>

<style scoped>
@media print {
  .print\:hidden { display: none !important; }
  .only-print { display: block !important; }
  @page { size: A4; margin: 12mm; }
  html, body { background: #fff !important; }
}
</style>
