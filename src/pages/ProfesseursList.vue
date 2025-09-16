<!-- pages/ProfesseursList.vue -->
<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div class="mx-auto max-w-6xl p-4 sm:p-6">
        <PageHeader title="Professeurs">
          <template #actions>
            <button
              class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white
                     hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
                     dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400"
              @click="openCreate()"
            >
              Nouveau
            </button>
          </template>
        </PageHeader>

        <!-- Barre de filtres -->
        <FilterBar v-model="filters" @reset="onResetFilters">
          <select
            v-model="filters.matiere"
            class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                   text-gray-900 shadow-sm
                   focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                   dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
                   dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
          >
            <option value="">Matière</option>
            <option v-for="m in matieresOptions" :key="m" :value="m">{{ m }}</option>
          </select>

          <select
            v-model="filters.statut"
            class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                   text-gray-900 shadow-sm
                   focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                   dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
                   dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
          >
            <option value="">Statut</option>
            <option>Actif</option>
            <option>Inactif</option>
          </select>

          <button
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium
                   text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500
                   dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-indigo-400"
            @click="applyFilters"
          >
            Filtrer
          </button>
        </FilterBar>

        <!-- Tableau -->
        <div class="rounded-xl border border-gray-200 bg-white p-3 shadow-sm
                    dark:border-gray-700 dark:bg-gray-900">
          <DataTable
            :rows="rows"
            :headers="headers"
            idKey="id"
            @edit="(r)=>openEdit(r)"
            @remove="(r)=>removeRow(r)"
          />
        </div>

        <!-- Modal CRUD -->
        <CrudModal
          :open="modalOpen"
          :title="form.id ? 'Modifier professeur' : 'Créer professeur'"
          @close="modalOpen=false"
          @submit="save()"
        >
          <div class="grid gap-3 sm:grid-cols-2">
            <label class="text-gray-700 dark:text-gray-200">
              Nom
              <input
                v-model="form.nom"
                class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                       text-gray-900 shadow-sm placeholder-gray-500
                       focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                       dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                       dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                required
              />
            </label>
            <label class="text-gray-700 dark:text-gray-200">
              Prénom
              <input
                v-model="form.prenom"
                class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                       text-gray-900 shadow-sm placeholder-gray-500
                       focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                       dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                       dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                required
              />
            </label>
            <label class="text-gray-700 dark:text-gray-200">
              Email
              <input
                v-model="form.email"
                type="email"
                class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                       text-gray-900 shadow-sm placeholder-gray-500
                       focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                       dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                       dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                required
              />
            </label>
            <label class="text-gray-700 dark:text-gray-200">
              Matière
              <input
                v-model="form.matiere"
                list="matiere-list"
                class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                       text-gray-900 shadow-sm placeholder-gray-500
                       focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                       dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                       dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
              />
              <datalist id="matiere-list">
                <option v-for="m in matieresOptions" :key="m" :value="m" />
              </datalist>
            </label>
            <label class="text-gray-700 dark:text-gray-200">
              Statut
              <select
                v-model="form.statut"
                class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                       text-gray-900 shadow-sm
                       focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                       dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100
                       dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
              >
                <option>Actif</option>
                <option>Inactif</option>
              </select>
            </label>
          </div>
        </CrudModal>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSchoolStore } from '@/stores/school'
import PageHeader from '@/components/PageHeader.vue'
import FilterBar from '@/components/FilterBar.vue'
import DataTable from '@/components/DataTable.vue'
import CrudModal from '@/components/CrudModal.vue'
import AppLayout from '@/components/layout/AppLayout.vue'

const school = useSchoolStore()

const headers = [
  { key:'nom',label:'Nom' },
  { key:'prenom',label:'Prénom' },
  { key:'email',label:'Email' },
  { key:'matiere',label:'Matière' },
  { key:'statut',label:'Statut' }
]

const filters = ref({ q:'', matiere:'', statut:'' })
const matieresOptions = computed(() => school.uniqueMatieres)

// ===== Données affichées =====
const rows = computed(() => {
  const q = normalize(filters.value.q)
  const fMatiere = filters.value.matiere
  const fStatut = filters.value.statut

  return school.teachers.filter(r => {
    const haystack = normalize(`${r.nom} ${r.prenom} ${r.email} ${r.matiere} ${r.statut}`)
    const matchesQ = q ? haystack.includes(q) : true
    const matchesMatiere = fMatiere ? r.matiere === fMatiere : true
    const matchesStatut = fStatut ? r.statut === fStatut : true
    return matchesQ && matchesMatiere && matchesStatut
  })
})

// ===== Modal / Form =====
const modalOpen = ref(false)
const form = ref({ id:null, nom:'', prenom:'', email:'', matiere:'', statut:'Actif' })

function onResetFilters () {
  filters.value = { q:'', matiere:'', statut:'' }
}

function openCreate () {
  form.value = { id:null, nom:'', prenom:'', email:'', matiere:'', statut:'Actif' }
  modalOpen.value = true
}
function openEdit (r) {
  form.value = { ...r }
  modalOpen.value = true
}
function save () {
  form.value.id ? update() : create()
  modalOpen.value = false
}
function create () {
  school.addTeacher({ ...form.value })
}
function update () {
  school.updateTeacher({ ...form.value })
}
function removeRow (r) {
  school.removeTeacher(r.id)
}

// ===== Utils =====
function normalize (s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}
function applyFilters () {
  // laissé pour compat avec le bouton "Filtrer" (mais rows est computed)
  // rien à faire ici, le computed se mettra à jour tout seul.
}
</script>
