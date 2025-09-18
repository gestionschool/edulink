<template>
  <section class="space-y-4">
    <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Professeurs</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Gestion des enseignants</p>
      </div>
      <form @submit.prevent="add" class="flex gap-2">
        <input v-model="form.nom" class="px-3 py-2 rounded border dark:bg-slate-900" placeholder="Nom" required />
        <input v-model="form.matiere" class="px-3 py-2 rounded border dark:bg-slate-900" placeholder="Matière" required />
        <button class="px-3 py-2 rounded bg-indigo-600 text-white">Ajouter</button>
      </form>
    </header>

    <div class="overflow-x-auto rounded-xl border dark:border-slate-800">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-50 dark:bg-slate-900/50">
          <tr class="text-left">
            <th class="p-3">#</th><th class="p-3">Nom</th><th class="p-3">Prénom</th><th class="p-3">Matière</th><th class="p-3 w-1"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in school.teachers" :key="t.id" class="border-t dark:border-slate-800">
            <td class="p-3">{{ t.id }}</td>
            <td class="p-3">{{ t.nom }}</td>
            <td class="p-3">{{ t.prenom || '—' }}</td>
            <td class="p-3">{{ t.matiere }}</td>
            <td class="p-3 text-right">
              <button class="text-red-600 hover:underline" @click="remove(t.id)">Supprimer</button>
            </td>
          </tr>
          <tr v-if="!school.teachers.length">
            <td colspan="5" class="p-4 text-center text-slate-500">Aucun professeur</td>
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
const form = reactive({ nom:'', matiere:'' })
function add(){
  if(!form.nom || !form.matiere) return
  school.addTeacher({ nom: form.nom, matiere: form.matiere })
  form.nom = ''; form.matiere = ''
}
function remove(id){ school.removeTeacher(id) }
</script>
