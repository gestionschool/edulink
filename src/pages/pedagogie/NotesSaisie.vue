<template>
  <section class="space-y-4">
    <header>
      <h1 class="text-xl font-semibold">Saisie des notes</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400">Créer / mettre à jour une évaluation d’un élève</p>
    </header>

    <div class="grid gap-3 md:grid-cols-2">
      <div class="rounded-xl border p-4 space-y-3 bg-white dark:bg-slate-900 dark:border-slate-800">
        <div class="grid gap-2 sm:grid-cols-2">
          <label class="block">
            <span class="text-xs text-slate-500">Classe</span>
            <select v-model.number="classeId" class="mt-1 w-full px-3 py-2 rounded border dark:bg-slate-900">
              <option :value="0" disabled>— Choisir —</option>
              <option v-for="c in school.classesView" :key="c.id" :value="c.id">{{ c.libelle }}</option>
            </select>
          </label>
          <label class="block">
            <span class="text-xs text-slate-500">Élève</span>
            <select v-model.number="eleveId" class="mt-1 w-full px-3 py-2 rounded border dark:bg-slate-900" :disabled="!classeId">
              <option :value="0" disabled>— Choisir —</option>
              <option v-for="e in elevesClasse" :key="e.id" :value="e.id">{{ e.nom }}</option>
            </select>
          </label>
        </div>

        <div class="grid gap-2 sm:grid-cols-3">
          <label class="block">
            <span class="text-xs text-slate-500">Période</span>
            <select v-model.number="periodeId" class="mt-1 w-full px-3 py-2 rounded border dark:bg-slate-900">
              <option v-for="p in school.periodes" :key="p.id" :value="p.id">{{ p.label }}</option>
            </select>
          </label>
          <label class="block sm:col-span-2">
            <span class="text-xs text-slate-500">Cours (matière)</span>
            <select v-model.number="coursId" class="mt-1 w-full px-3 py-2 rounded border dark:bg-slate-900" :disabled="!classeId">
              <option :value="0" disabled>— Choisir —</option>
              <option v-for="c in coursClasse" :key="c.id" :value="c.id">{{ c.matiere }} — {{ c.intitule }}</option>
            </select>
          </label>
        </div>

        <div class="grid gap-2 sm:grid-cols-3">
          <label class="block">
            <span class="text-xs text-slate-500">Type</span>
            <select v-model="type" class="mt-1 w-full px-3 py-2 rounded border dark:bg-slate-900">
              <option>Devoir</option><option>Interro</option><option>Examen</option>
            </select>
          </label>
          <label class="block">
            <span class="text-xs text-slate-500">Coef</span>
            <input v-model.number="coef" type="number" min="1" class="mt-1 w-full px-3 py-2 rounded border dark:bg-slate-900"/>
          </label>
          <label class="block">
            <span class="text-xs text-slate-500">Note (/20)</span>
            <input v-model.number="note" type="number" step="0.5" min="0" max="20" class="mt-1 w-full px-3 py-2 rounded border dark:bg-slate-900"/>
          </label>
        </div>

        <button class="w-full sm:w-auto px-4 py-2 rounded bg-indigo-600 text-white" :disabled="!canSave" @click="save">
          Enregistrer
        </button>
      </div>

      <!-- Historique élève/période -->
      <div class="rounded-xl border p-4 bg-white dark:bg-slate-900 dark:border-slate-800">
        <h3 class="font-semibold mb-2">Évaluations ({{ eleve?.nom || '—' }}, {{ periode?.label || '—' }})</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-slate-50 dark:bg-slate-900/50">
              <tr class="text-left">
                <th class="p-3">Matière</th><th class="p-3">Type</th><th class="p-3">Coef</th><th class="p-3">Note</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in evals" :key="r.id || r.matiere + r.type + r.coef + r.note" class="border-t dark:border-slate-800">
                <td class="p-3">{{ r.matiere }}</td>
                <td class="p-3">{{ r.type }}</td>
                <td class="p-3">{{ r.coef }}</td>
                <td class="p-3">{{ r.note }}</td>
              </tr>
              <tr v-if="!evals.length"><td colspan="4" class="p-4 text-center text-slate-500">Aucune note</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useSchoolStore } from '@/stores/school'
const school = useSchoolStore()

const classeId = ref(0)
const eleveId  = ref(0)
const coursId  = ref(0)
const periodeId= ref(school.periodes.find(p => p.active)?.id ?? school.periodes[0]?.id ?? 0)
const type     = ref('Devoir')
const coef     = ref(1)
const note     = ref(10)

const elevesClasse = computed(() => school.students.filter(s => s.classeId === classeId.value))
const coursClasse  = computed(() => school.cours.filter(c => c.classeId === classeId.value && (!periodeId.value || c.periodeId === periodeId.value)))
const eleve        = computed(() => school.getStudent(eleveId.value))
const periode      = computed(() => school.getPeriode(periodeId.value))

watch(classeId, () => { eleveId.value = 0; coursId.value = 0 })

const evals = computed(() => eleveId.value && periodeId.value ? school.getEvaluations(eleveId.value, periodeId.value) : [])

const canSave = computed(() => !!(classeId.value && eleveId.value && coursId.value && periodeId.value && coef.value > 0))

function save(){
  const cours = school.coursById[coursId.value]
  if(!cours) return
  school.upsertEvaluation({
    eleveId: Number(eleveId.value),
    periodeId: Number(periodeId.value),
    matiere: cours.matiere,
    type: type.value,
    coef: Number(coef.value),
    note: Number(note.value),
    obs: '',
  })
}
</script>
