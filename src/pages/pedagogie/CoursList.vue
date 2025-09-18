<template>
  <section class="space-y-5">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold">Cours / Matières</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Affectations par classe & professeur</p>
      </div>

      <!-- Formulaire : fluide en mobile, compact en grand écran -->
      <form @submit.prevent="add" class="flex flex-wrap gap-2">
        <input
          v-model="form.code"
          placeholder="Code (ex: MAT101)"
          class="w-full sm:w-auto sm:flex-1 min-w-[160px] px-3 py-2 rounded border dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          required
        />
        <input
          v-model="form.matiere"
          placeholder="Matière"
          class="w-full sm:w-auto sm:flex-1 min-w-[160px] px-3 py-2 rounded border dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          required
        />
        <input
          v-model="form.intitule"
          placeholder="Intitulé"
          class="w-full sm:w-auto sm:flex-1 min-w-[200px] px-3 py-2 rounded border dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          required
        />

        <select
          v-model.number="form.classeId"
          class="w-full sm:w-auto min-w-[160px] px-3 py-2 rounded border dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          required
        >
          <option :value="0" disabled>— Classe —</option>
          <option v-for="c in school.classesView" :key="c.id" :value="c.id">{{ c.libelle }}</option>
        </select>

        <select
          v-model.number="form.teacherId"
          class="w-full sm:w-auto min-w-[180px] px-3 py-2 rounded border dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          required
        >
          <option :value="0" disabled>— Professeur —</option>
          <option v-for="t in school.teachers" :key="t.id" :value="t.id">{{ t.nom }} ({{ t.matiere }})</option>
        </select>

        <select
          v-model.number="form.periodeId"
          class="w-full sm:w-auto min-w-[160px] px-3 py-2 rounded border dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          required
        >
          <option :value="0" disabled>— Période —</option>
          <option v-for="p in school.periodes" :key="p.id" :value="p.id">{{ p.label }}</option>
        </select>

        <input
          v-model.number="form.volume" type="number" min="0" placeholder="Volume"
          class="w-full sm:w-28 px-3 py-2 rounded border dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />

        <button class="w-full sm:w-auto px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition">
          Ajouter
        </button>
      </form>
    </header>

    <!-- LISTE MOBILE (cartes) -->
    <ul class="sm:hidden space-y-3">
      <li
        v-for="c in school.coursView"
        :key="c.id"
        class="rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="font-semibold truncate">
              {{ c.code }} • {{ c.intitule }}
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 truncate">
              {{ c.matiere }} — {{ c.classe }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Prof: {{ c.professeur }} • Période: {{ c.periode }}
            </p>
          </div>
          <button
            class="shrink-0 text-red-600 hover:underline"
            @click="school.removeCours(c.id)"
          >
            Supprimer
          </button>
        </div>
      </li>
      <li v-if="!school.coursView.length" class="rounded-xl border dark:border-slate-800 p-4 text-center text-slate-500">
        Aucun cours
      </li>
    </ul>

    <!-- TABLEAU ≥ sm -->
    <div class="hidden sm:block overflow-x-auto rounded-xl border dark:border-slate-800">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-50 dark:bg-slate-900/50">
          <tr class="text-left">
            <th class="p-3">Code</th>
            <th class="p-3 hidden md:table-cell">Intitulé</th>
            <th class="p-3 hidden lg:table-cell">Matière</th>
            <th class="p-3">Classe</th>
            <th class="p-3">Professeur</th>
            <th class="p-3 hidden xl:table-cell">Période</th>
            <th class="p-3 w-1"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in school.coursView" :key="c.id" class="border-t dark:border-slate-800">
            <td class="p-3 font-medium">{{ c.code }}</td>
            <td class="p-3 hidden md:table-cell truncate">{{ c.intitule }}</td>
            <td class="p-3 hidden lg:table-cell truncate">{{ c.matiere }}</td>
            <td class="p-3">{{ c.classe }}</td>
            <td class="p-3 truncate">{{ c.professeur }}</td>
            <td class="p-3 hidden xl:table-cell">{{ c.periode }}</td>
            <td class="p-3 text-right">
              <button class="text-red-600 hover:underline" @click="school.removeCours(c.id)">Supprimer</button>
            </td>
          </tr>
          <tr v-if="!school.coursView.length">
            <td colspan="7" class="p-4 text-center text-slate-500">Aucun cours</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import { useSchoolStore } from '@/stores/school'
const school = useSchoolStore()
const form = reactive({ code:'', matiere:'', intitule:'', classeId:0, teacherId:0, periodeId:0, volume:0 })

function add(){
  const { code, matiere, intitule, classeId, teacherId, periodeId } = form
  if(!code || !matiere || !intitule || !classeId || !teacherId || !periodeId) return
  school.addCours({ ...form, classeId:Number(classeId), teacherId:Number(teacherId), periodeId:Number(periodeId) })
  Object.assign(form, { code:'', matiere:'', intitule:'', classeId:0, teacherId:0, periodeId:0, volume:0 })
}
</script>
