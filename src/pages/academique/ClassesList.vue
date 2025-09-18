<template>
  <section class="space-y-4">
    <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Classes</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Structure des classes</p>
      </div>
      <form @submit.prevent="add" class="flex flex-wrap gap-2">
        <input v-model="form.code" placeholder="Code (ex: 6A)" class="px-3 py-2 rounded border dark:bg-slate-900" required/>
        <input v-model="form.libelle" placeholder="Libellé" class="px-3 py-2 rounded border dark:bg-slate-900" required/>
        <input v-model="form.niveau" placeholder="Niveau" class="px-3 py-2 rounded border dark:bg-slate-900" required/>
        <input v-model="form.filiere" placeholder="Filière" class="px-3 py-2 rounded border dark:bg-slate-900" required/>
        <button class="px-3 py-2 rounded bg-indigo-600 text-white">Ajouter</button>
      </form>
    </header>

    <div class="overflow-x-auto rounded-xl border dark:border-slate-800">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-50 dark:bg-slate-900/50">
          <tr class="text-left">
            <th class="p-3">#</th><th class="p-3">Code</th><th class="p-3">Libellé</th><th class="p-3">Niveau</th><th class="p-3">Filière</th><th class="p-3 w-1"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in school.classesView" :key="c.id" class="border-t dark:border-slate-800">
            <td class="p-3">{{ c.id }}</td>
            <td class="p-3">{{ c.code }}</td>
            <td class="p-3">{{ c.libelle }}</td>
            <td class="p-3">{{ c.niveau }}</td>
            <td class="p-3">{{ c.filiere }}</td>
            <td class="p-3 text-right">
              <button class="text-red-600 hover:underline" @click="remove(c.id)">Supprimer</button>
            </td>
          </tr>
          <tr v-if="!school.classesView.length">
            <td colspan="6" class="p-4 text-center text-slate-500">Aucune classe</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="text-xs text-slate-500">
      Supprimer une classe détache les élèves et supprime les cours/interros/examens/devoirs liés (géré dans le store).
    </p>
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import { useSchoolStore } from '@/stores/school'
const school = useSchoolStore()
const form = reactive({ code:'', libelle:'', niveau:'', filiere:'' })
function add(){
  if(!form.code || !form.libelle) return
  school.addClasse({ ...form })
  form.code=''; form.libelle=''; form.niveau=''; form.filiere=''
}
function remove(id){ school.removeClasse(id) }
</script>
