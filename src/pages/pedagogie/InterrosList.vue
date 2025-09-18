<template>
  <section class="space-y-5">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold">Interrogations</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Contrôles rapides</p>
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
          class="w-full sm:w-auto min-w-[160px] px-3 py-2 rounded border dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <option>Programmée</option>
          <option>Surprise</option>
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
        <option v-for="o in school.uniqueInterroCours" :key="o">{{ o }}</option>
      </select>
      <select v-model="filterClasse" class="w-full sm:w-auto min-w-[160px] px-3 py-2 rounded border dark:bg-slate-900">
        <option value="">Toutes classes</option>
        <option v-for="o in school.uniqueInterroClasses" :key="o">{{ o }}</option>
      </select>
    </div>

    <!-- LISTE MOBILE (cartes) -->
    <ul class="sm:hidden space-y-3">
      <li
        v-for="r in filtered"
        :key="r.id"
        class="rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="font-semibold truncate">{{ r.titre }}</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 truncate">
              {{ r.cours }} — {{ r.classe }}
            </p>
            <div class="mt-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span>Date : {{ r.date }}</span>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2 shrink-0">
            <span :class="['px-2 py-0.5 text-xs rounded-full', typeClass(r.type)]">{{ r.type }}</span>
            <button class="text-xs text-red-600 hover:underline" @click="school.removeInterro(r.id)">Supprimer</button>
          </div>
        </div>
      </li>
      <li v-if="!filtered.length" class="rounded-xl border dark:border-slate-800 p-4 text-center text-slate-500">
        Aucune interro
      </li>
    </ul>

    <!-- TABLEAU ≥ sm -->
    <div class="hidden sm:block overflow-x-auto rounded-xl border dark:border-slate-800">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-50 dark:bg-slate-900/50">
          <tr class="text-left">
            <th class="p-3">Titre</th>
            <th class="p-3">Type</th>
            <th class="p-3">Date</th>
            <th class="p-3">Cours</th>
            <th class="p-3 hidden md:table-cell">Classe</th>
            <th class="p-3 w-1"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in filtered" :key="r.id" class="border-t dark:border-slate-800">
            <td class="p-3 font-medium truncate">{{ r.titre }}</td>
            <td class="p-3">
              <span :class="['px-2 py-0.5 text-xs rounded-full', typeClass(r.type)]">{{ r.type }}</span>
            </td>
            <td class="p-3">{{ r.date }}</td>
            <td class="p-3 truncate">{{ r.cours }}</td>
            <td class="p-3 hidden md:table-cell">{{ r.classe }}</td>
            <td class="p-3 text-right">
              <button class="text-red-600 hover:underline" @click="school.removeInterro(r.id)">Supprimer</button>
            </td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="6" class="p-4 text-center text-slate-500">Aucune interro</td></tr>
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

const form = reactive({ titre:'', type:'Programmée', date:'', coursId:0 })
function add() {
  if (!form.titre || !form.date || !form.coursId) return
  school.addInterro({ ...form, coursId: Number(form.coursId) })
  Object.assign(form, { titre:'', type:'Programmée', date:'', coursId:0 })
}

const filterCours = ref('')
const filterClasse = ref('')

const filtered = computed(() =>
  school.interrosView.filter(r =>
    (!filterCours.value || r.cours === filterCours.value) &&
    (!filterClasse.value || r.classe === filterClasse.value)
  )
)

function typeClass(t) {
  return t === 'Surprise'
    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200'
    : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200'
}
</script>
