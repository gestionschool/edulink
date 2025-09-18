<template>
  <section class="space-y-5">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold">Devoirs</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Travaux à rendre</p>
      </div>

      <!-- Formulaire : fluide en mobile, compact en grand écran -->
      <form @submit.prevent="add" class="flex flex-wrap gap-2">
        <input
          v-model="form.titre"
          placeholder="Titre"
          class="w-full sm:w-auto sm:flex-1 min-w-[180px] px-3 py-2 rounded border dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          required
        />
        <input
          v-model="form.dateRemise" type="date"
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
          v-model.number="form.periodeId"
          class="w-full sm:w-auto min-w-[160px] px-3 py-2 rounded border dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <option :value="0">Période (auto)</option>
          <option v-for="p in school.periodes" :key="p.id" :value="p.id">{{ p.label }}</option>
        </select>
        <input
          v-model.number="form.bareme" type="number" min="1" placeholder="Barème"
          class="w-full sm:w-24 px-3 py-2 rounded border dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
        <select
          v-model="form.statut"
          class="w-full sm:w-auto min-w-[140px] px-3 py-2 rounded border dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <option>Publié</option>
          <option>Archivé</option>
        </select>
        <button class="w-full sm:w-auto px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition">
          Ajouter
        </button>
      </form>
    </header>

    <!-- Filtres -->
    <div class="flex flex-wrap gap-2">
      <select v-model="filterCours" class="w-full sm:w-auto min-w-[180px] px-3 py-2 rounded border dark:bg-slate-900">
        <option value="">Tous cours</option>
        <option v-for="o in school.uniqueDevoirCours" :key="o">{{ o }}</option>
      </select>
      <select v-model="filterClasse" class="w-full sm:w-auto min-w-[160px] px-3 py-2 rounded border dark:bg-slate-900">
        <option value="">Toutes classes</option>
        <option v-for="o in school.uniqueDevoirClasses" :key="o">{{ o }}</option>
      </select>
      <select v-model="filterPeriode" class="w-full sm:w-auto min-w-[160px] px-3 py-2 rounded border dark:bg-slate-900">
        <option value="">Toutes périodes</option>
        <option v-for="o in school.uniqueDevoirPeriodes" :key="o">{{ o }}</option>
      </select>
      <select v-model="filterStatut" class="w-full sm:w-auto min-w-[140px] px-3 py-2 rounded border dark:bg-slate-900">
        <option value="">Tous statuts</option>
        <option v-for="o in school.uniqueDevoirStatuts" :key="o">{{ o }}</option>
      </select>
    </div>

    <!-- LISTE MOBILE (cartes) -->
    <ul class="sm:hidden space-y-3">
      <li
        v-for="d in filtered"
        :key="d.id"
        class="rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="font-semibold truncate">{{ d.titre }}</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 truncate">
              {{ d.cours }} — {{ d.classe }}
            </p>
            <div class="mt-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span>Remise : {{ d.dateRemise }}</span>
              <span class="mx-1">•</span>
              <span>Période : {{ d.periode }}</span>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2 shrink-0">
            <span :class="['px-2 py-0.5 text-xs rounded-full', statutClass(d.statut)]">{{ d.statut }}</span>
            <button class="text-xs text-red-600 hover:underline" @click="school.removeDevoir(d.id)">Supprimer</button>
          </div>
        </div>
      </li>
      <li v-if="!filtered.length" class="rounded-xl border dark:border-slate-800 p-4 text-center text-slate-500">
        Aucun devoir
      </li>
    </ul>

    <!-- TABLEAU ≥ sm -->
    <div class="hidden sm:block overflow-x-auto rounded-xl border dark:border-slate-800">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-50 dark:bg-slate-900/50">
          <tr class="text-left">
            <th class="p-3">Titre</th>
            <th class="p-3">Cours</th>
            <th class="p-3 hidden md:table-cell">Classe</th>
            <th class="p-3 hidden lg:table-cell">Période</th>
            <th class="p-3">Remise</th>
            <th class="p-3">Statut</th>
            <th class="p-3 w-1"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in filtered" :key="d.id" class="border-t dark:border-slate-800">
            <td class="p-3 font-medium truncate">{{ d.titre }}</td>
            <td class="p-3 truncate">{{ d.cours }}</td>
            <td class="p-3 hidden md:table-cell">{{ d.classe }}</td>
            <td class="p-3 hidden lg:table-cell">{{ d.periode }}</td>
            <td class="p-3">{{ d.dateRemise }}</td>
            <td class="p-3">
              <span :class="['px-2 py-0.5 text-xs rounded-full', statutClass(d.statut)]">{{ d.statut }}</span>
            </td>
            <td class="p-3 text-right">
              <button class="text-red-600 hover:underline" @click="school.removeDevoir(d.id)">Supprimer</button>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td colspan="7" class="p-4 text-center text-slate-500">Aucun devoir</td>
          </tr>
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

const form = reactive({ titre:'', dateRemise:'', coursId:0, bareme:20, statut:'Publié', periodeId:0 })
function add(){
  if(!form.titre || !form.dateRemise || !form.coursId) return
  const payload = { ...form, coursId:Number(form.coursId), periodeId: form.periodeId || undefined }
  school.addDevoir(payload)
  Object.assign(form, { titre:'', dateRemise:'', coursId:0, bareme:20, statut:'Publié', periodeId:0 })
}

const filterCours = ref('')
const filterClasse = ref('')
const filterPeriode = ref('')
const filterStatut = ref('')

const filtered = computed(() =>
  school.devoirsView.filter(d =>
    (!filterCours.value   || d.cours   === filterCours.value)   &&
    (!filterClasse.value  || d.classe  === filterClasse.value)  &&
    (!filterPeriode.value || d.periode === filterPeriode.value) &&
    (!filterStatut.value  || d.statut  === filterStatut.value)
  )
)

function statutClass(s){
  return s === 'Publié'
    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200'
    : 'bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200'
}
</script>
