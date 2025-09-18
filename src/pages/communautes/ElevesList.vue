<template>
  <section class="space-y-4">
    <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Élèves</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Gestion des élèves</p>
      </div>
      <form @submit.prevent="add" class="flex gap-2">
        <input v-model="form.nom" class="px-3 py-2 rounded border dark:bg-slate-900" placeholder="Nom élève" required />
        <select v-model.number="form.classeId" class="px-3 py-2 rounded border dark:bg-slate-900" required>
          <option :value="0" disabled>— Classe —</option>
          <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.libelle }}</option>
        </select>
        <button class="px-3 py-2 rounded bg-indigo-600 text-white">Ajouter</button>
      </form>
    </header>

    <div class="flex flex-wrap gap-2 items-center">
      <input v-model="q" placeholder="Rechercher…" class="px-3 py-2 rounded border dark:bg-slate-900" />
      <select v-model.number="classeFilter" class="px-3 py-2 rounded border dark:bg-slate-900">
        <option :value="0">Toutes les classes</option>
        <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.libelle }}</option>
      </select>
    </div>

    <div class="overflow-x-auto rounded-xl border dark:border-slate-800">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-50 dark:bg-slate-900/50">
          <tr class="text-left">
            <th class="p-3">#</th>
            <th class="p-3">Nom</th>
            <th class="p-3">Matricule</th>
            <th class="p-3">Classe</th>
            <th class="p-3 w-1"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in filtered" :key="e.id" class="border-t dark:border-slate-800">
            <td class="p-3">{{ e.id }}</td>
            <td class="p-3">{{ e.nom }}</td>
            <td class="p-3">{{ e.matricule || '—' }}</td>
            <td class="p-3">{{ classeLabel(e.classeId) }}</td>
            <td class="p-3 text-right">
              <button class="text-red-600 hover:underline" @click="remove(e.id)">Supprimer</button>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td colspan="5" class="p-4 text-center text-slate-500">Aucun élève</td>
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
const classes = computed(() => school.classesView)
const classeLabel = (id) => school.getClasse(id)?.libelle || school.getClasse(id)?.label || '—'

const q = ref('')
const classeFilter = ref(0)
const filtered = computed(() => {
  const qv = q.value.toLowerCase()
  return school.students
    .filter(e => !classeFilter.value || e.classeId === classeFilter.value)
    .filter(e => !qv || e.nom.toLowerCase().includes(qv) || (e.matricule||'').toLowerCase().includes(qv))
})

const form = reactive({ nom: '', classeId: 0 })
function add(){
  if(!form.nom || !form.classeId) return
  school.addEtudiant({ nom: form.nom, classeId: Number(form.classeId) })
  form.nom = ''; form.classeId = 0
}
function remove(id){ school.removeEtudiant(id) }
</script>
