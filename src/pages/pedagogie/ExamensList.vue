<template>
  <section class="space-y-5">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold">Examens</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Évaluations majeures</p>
      </div>

      <!-- Formulaire : fluide mobile, compact desktop -->
      <form @submit.prevent="add" class="flex flex-wrap gap-2">
        <input
          v-model="form.titre"
          placeholder="Titre"
          class="w-full sm:w-auto sm:flex-1 min-w-[180px] px-3 py-2 rounded border dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          required
        />
        <input
          v-model="form.date" type="date"
          class="w-full sm:w-auto min-w-[160px] px-3 py-2 rounded border dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          required
        />
        <select
          v-model.number="form.coursId"
          class="w-full sm:w-auto min-w-[220px] px-3 py-2 rounded border dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          required
        >
          <option :value="0" disabled>— Cours —</option>
          <option v-for="c in school.cours" :key="c.id" :value="c.id">
            {{ c.matiere }} — {{ classeLabel(c.classeId) }}
          </option>
        </select>
        <select
          v-model="form.type"
          class="w-full sm:w-auto min-w-[140px] px-3 py-2 rounded border dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <option>Final</option>
          <option>Partiel</option>
        </select>
        <select
          v-model="form.session"
          class="w-full sm:w-auto min-w-[160px] px-3 py-2 rounded border dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <option>Normale</option>
          <option>Rattrapage</option>
        </select>
        <input
          v-model.number="form.bareme" type="number" min="1" placeholder="Barème"
          class="w-full sm:w-24 px-3 py-2 rounded border dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
        <button class="w-full sm:w-auto px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition">
          Ajouter
        </button>
      </form>
    </header>

    <!-- Filtres -->
    <div class="flex flex-wrap gap-2">
      <select v-model="filterCours" class="w-full sm:w-auto min-w-[180px] px-3 py-2 rounded border dark:bg-slate-900">
        <option value="">Tous cours</option>
        <option v-for="o in school.uniqueExamCours" :key="o">{{ o }}</option>
      </select>
      <select v-model="filterClasse" class="w-full sm:w-auto min-w-[160px] px-3 py-2 rounded border dark:bg-slate-900">
        <option value="">Toutes classes</option>
        <option v-for="o in school.uniqueExamClasses" :key="o">{{ o }}</option>
      </select>
      <select v-model="filterSession" class="w-full sm:w-auto min-w-[160px] px-3 py-2 rounded border dark:bg-slate-900">
        <option value="">Toutes sessions</option>
        <option v-for="o in school.uniqueExamSessions" :key="o">{{ o }}</option>
      </select>
    </div>

    <!-- LISTE MOBILE (cartes) -->
    <ul class="sm:hidden space-y-3">
      <li
        v-for="e in filtered"
        :key="e.id"
        class="rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="font-semibold truncate">{{ e.titre }}</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 truncate">
              {{ e.cours }} — {{ e.classe }}
            </p>
            <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span>Date : {{ e.date }}</span>
              <span class="mx-1 hidden xs:inline">•</span>
              <span class="flex items-center gap-2">
                <span :class="['px-2 py-0.5 rounded-full', typeClass(e.type)]">{{ e.type }}</span>
                <span :class="['px-2 py-0.5 rounded-full', sessionClass(e.session)]">{{ e.session }}</span>
              </span>
            </div>
          </div>
          <button class="text-xs text-red-600 hover:underline shrink-0" @click="school.removeExamen(e.id)">Supprimer</button>
        </div>
      </li>
      <li v-if="!filtered.length" class="rounded-xl border dark:border-slate-800 p-4 text-center text-slate-500">
        Aucun examen
      </li>
    </ul>

    <!-- TABLEAU ≥ sm -->
    <div class="hidden sm:block overflow-x-auto rounded-xl border dark:border-slate-800">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-50 dark:bg-slate-900/50">
          <tr class="text-left">
            <th class="p-3">Titre</th>
            <th class="p-3">Type</th>
            <th class="p-3">Session</th>
            <th class="p-3">Date</th>
            <th class="p-3">Cours</th>
            <th class="p-3 hidden md:table-cell">Classe</th>
            <th class="p-3 w-1"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in filtered" :key="e.id" class="border-t dark:border-slate-800">
            <td class="p-3 font-medium truncate">{{ e.titre }}</td>
            <td class="p-3">
              <span :class="['px-2 py-0.5 text-xs rounded-full', typeClass(e.type)]">{{ e.type }}</span>
            </td>
            <td class="p-3">
              <span :class="['px-2 py-0.5 text-xs rounded-full', sessionClass(e.session)]">{{ e.session }}</span>
            </td>
            <td class="p-3">{{ e.date }}</td>
            <td class="p-3 truncate">{{ e.cours }}</td>
            <td class="p-3 hidden md:table-cell">{{ e.classe }}</td>
            <td class="p-3 text-right">
              <button class="text-red-600 hover:underline" @click="school.removeExamen(e.id)">Supprimer</button>
            </td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="7" class="p-4 text-center text-slate-500">Aucun examen</td></tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useSchoolStore } from '@/stores/school'

const school = useSchoolStore()
const classeLabel = (id) => school.getClasse(id)?.libelle || school.getClasse(id)?.label || '—'

const form = reactive({ titre:'', type:'Final', session:'Normale', date:'', coursId:0, bareme:20 })
function add(){
  if(!form.titre || !form.date || !form.coursId) return
  school.addExamen({ ...form, coursId: Number(form.coursId) })
  Object.assign(form, { titre:'', type:'Final', session:'Normale', date:'', coursId:0, bareme:20 })
}

const filterCours = ref('')
const filterClasse = ref('')
const filterSession = ref('')

const filtered = computed(() =>
  school.examensView.filter(e =>
    (!filterCours.value   || e.cours   === filterCours.value) &&
    (!filterClasse.value  || e.classe  === filterClasse.value) &&
    (!filterSession.value || e.session === filterSession.value)
  )
)

function typeClass(t){
  return t === 'Partiel'
    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200'
    : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200'
}
function sessionClass(s){
  return s === 'Rattrapage'
    ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200'
    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
}
</script>
