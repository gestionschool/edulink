<!-- pages/AdminUsersList.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <div class="mx-auto max-w-6xl p-4 sm:p-6">
      <PageHeader title="Utilisateurs">
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
          v-model="filters.role"
          class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                 text-gray-900 shadow-sm
                 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
                 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
        >
          <option value="">Rôle</option>
          <option>admin</option>
          <option>professeur</option>
          <option>gestion</option>
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
      <div
        class="rounded-xl border border-gray-200 bg-white p-3 shadow-sm
               dark:border-gray-700 dark:bg-gray-900"
      >
        <DataTable
          :rows="rows"
          :headers="headers"
          idKey="id"
          @edit="openEdit"
          @remove="removeRow"
        />
      </div>

      <!-- Modal CRUD -->
      <CrudModal
        :open="modalOpen"
        :title="form.id ? 'Modifier utilisateur' : 'Créer utilisateur'"
        @close="modalOpen=false"
        @submit="save"
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
            Rôle
            <select
              v-model="form.role"
              class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                     text-gray-900 shadow-sm
                     focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                     dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100
                     dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
            >
              <option>admin</option>
              <option>professeur</option>
              <option>gestion</option>
            </select>
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

          <label v-if="!form.id" class="text-gray-700 dark:text-gray-200">
            Mot de passe
            <input
              v-model="form.password"
              type="password"
              class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                     text-gray-900 shadow-sm placeholder-gray-500
                     focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                     dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                     dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
              required
            />
          </label>
        </div>
      </CrudModal>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import FilterBar from '@/components/FilterBar.vue'
import DataTable from '@/components/DataTable.vue'
import CrudModal from '@/components/CrudModal.vue'

const headers = [
  { key: 'nom',          label: 'Nom' },
  { key: 'email',        label: 'Email' },
  { key: 'role',         label: 'Rôle' },
  { key: 'dernierAcces', label: 'Dernier accès' },
  { key: 'statut',       label: 'Statut' }
]

// Filtres
const filters = ref({ q:'', role:'', statut:'' })

// Données
const allRows = ref([])
const rows = ref([])

// Modal + Form
const modalOpen = ref(false)
const form = ref({ id:null, nom:'', email:'', role:'gestion', statut:'Actif', password:'' })

/* -------- CRUD/mock + load -------- */
function load () {
  allRows.value = mockData()
  applyFilters()
}
function openCreate () {
  form.value = { id:null, nom:'', email:'', role:'gestion', statut:'Actif', password:'' }
  modalOpen.value = true
}
function openEdit (r) {
  form.value = { ...r, password:'' }
  modalOpen.value = true
}
async function save () {
  form.value.id ? await update() : await create()
  modalOpen.value = false
  load()
}
async function create () { /* POST /users */ }
async function update () { /* PUT  /users/:id */ }
async function removeRow (r) {
  // DELETE /users/:id
  allRows.value = allRows.value.filter(x => x.id !== r.id)
  applyFilters()
}

/* ------------- Filtres ------------- */
function onResetFilters () {
  filters.value = { q:'', role:'', statut:'' }
  applyFilters()
}

// Normalisation : insensible aux accents/majuscules
function normalize (s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

function applyFilters () {
  const q = normalize(filters.value.q)
  const fRole = filters.value.role
  const fStatut = filters.value.statut

  rows.value = allRows.value.filter(r => {
    const haystack = normalize(`${r.nom} ${r.email} ${r.role} ${r.statut} ${r.dernierAcces}`)
    const matchesQ = q ? haystack.includes(q) : true
    const matchesRole = fRole ? r.role === fRole : true
    const matchesStatut = fStatut ? r.statut === fStatut : true
    return matchesQ && matchesRole && matchesStatut
  })
}

// Auto-filtre (debounce)
let t
watch(filters, () => {
  clearTimeout(t)
  t = setTimeout(applyFilters, 150)
}, { deep: true })

/* ------------- Données mock ------------- */
function mockData () {
  return [
    { id:1, nom:'Admin', email:'admin@sas.com', role:'admin', dernierAcces:'2025-09-10 14:22', statut:'Actif' },
    { id:2, nom:'Paul',  email:'paul@ecole.com', role:'professeur', dernierAcces:'2025-09-14 09:10', statut:'Inactif' },
    { id:3, nom:'Mira',  email:'mira@ecole.com', role:'gestion', dernierAcces:'2025-09-15 11:30', statut:'Actif' }
  ]
}

load()
</script>
