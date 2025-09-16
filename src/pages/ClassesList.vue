<!-- pages/ClassesList.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <div class="mx-auto max-w-6xl p-4 sm:p-6">
      <PageHeader title="Classes">
        <template #actions>
          <button
            class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white
                   hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
                   dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400"
            @click="openCreate()"
          >
            Nouvelle
          </button>
        </template>
      </PageHeader>

      <!-- Barre de filtres -->
      <FilterBar v-model="filters" @reset="onResetFilters">
        <select
          v-model="filters.niveau"
          class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                 text-gray-900 shadow-sm
                 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
                 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
        >
          <option value="">Niveau</option>
          <option>1</option>
          <option>6</option>
        </select>

        <select
          v-model="filters.filiere"
          class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                 text-gray-900 shadow-sm
                 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
                 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
        >
          <option value="">Filière/Option</option>
          <option>Scientifique</option>
          <option>Littéraire</option>
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
        :title="form.id ? 'Modifier classe' : 'Créer classe'"
        @close="modalOpen=false"
        @submit="save"
      >
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="text-gray-700 dark:text-gray-200">
            Code
            <input
              v-model="form.code"
              class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                     text-gray-900 shadow-sm placeholder-gray-500
                     focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                     dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                     dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
              required
            />
          </label>
          <label class="text-gray-700 dark:text-gray-200">
            Libellé
            <input
              v-model="form.libelle"
              class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                     text-gray-900 shadow-sm placeholder-gray-500
                     focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                     dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                     dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
              required
            />
          </label>
          <label class="text-gray-700 dark:text-gray-200">
            Niveau
            <input
              v-model="form.niveau"
              class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                     text-gray-900 shadow-sm placeholder-gray-500
                     focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                     dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                     dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
            />
          </label>
          <label class="text-gray-700 dark:text-gray-200">
            Filière/Option
            <input
              v-model="form.filiere"
              class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                     text-gray-900 shadow-sm placeholder-gray-500
                     focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                     dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                     dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
            />
          </label>
          <label class="text-gray-700 dark:text-gray-200">
            Effectif
            <input
              v-model.number="form.effectif"
              type="number"
              min="0"
              class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                     text-gray-900 shadow-sm placeholder-gray-500
                     focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                     dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                     dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
            />
          </label>
          <label class="text-gray-700 dark:text-gray-200">
            Titulaire
            <input
              v-model="form.titulaire"
              class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                     text-gray-900 shadow-sm placeholder-gray-500
                     focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                     dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                     dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
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
  { key: 'code',     label: 'Code' },
  { key: 'libelle',  label: 'Libellé' },
  { key: 'niveau',   label: 'Niveau' },
  { key: 'filiere',  label: 'Filière' },
  { key: 'effectif', label: 'Effectif' },
  { key: 'titulaire',label: 'Titulaire' }
]

// Filtres
const filters = ref({ q: '', niveau: '', filiere: '' })

// Données
const allRows = ref([])
const rows = ref([])

// Modal + Form
const modalOpen = ref(false)
const form = ref({ id: null, code: '', libelle: '', niveau: '', filiere: '', effectif: 0, titulaire: '' })

/* -------- CRUD/mock + load -------- */
function load () {
  allRows.value = mockData()
  applyFilters()
}
function openCreate () {
  form.value = { id: null, code: '', libelle: '', niveau: '', filiere: '', effectif: 0, titulaire: '' }
  modalOpen.value = true
}
function openEdit (r) {
  form.value = { ...r }
  modalOpen.value = true
}
async function save () {
  form.value.id ? await update() : await create()
  modalOpen.value = false
  load()
}
async function create () { /* POST /classes */ }
async function update () { /* PUT  /classes/:id */ }
async function removeRow (r) {
  // DELETE /classes/:id
  allRows.value = allRows.value.filter(x => x.id !== r.id)
  applyFilters()
}

/* ------------- Filtres ------------- */
function onResetFilters () {
  filters.value = { q: '', niveau: '', filiere: '' }
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
  const fNiveau = filters.value.niveau
  const fFiliere = filters.value.filiere

  rows.value = allRows.value.filter(r => {
    // recherche plein-texte (code, libellé, niveau, filière, titulaire)
    const haystack = normalize(`${r.code} ${r.libelle} ${r.niveau} ${r.filiere} ${r.titulaire}`)
    const matchesQ = q ? haystack.includes(q) : true
    const matchesNiveau = fNiveau ? String(r.niveau) === String(fNiveau) : true
    const matchesFiliere = fFiliere ? r.filiere === fFiliere : true
    return matchesQ && matchesNiveau && matchesFiliere
  })
}

// Auto-filtre (debounce léger)
let t
watch(filters, () => {
  clearTimeout(t)
  t = setTimeout(applyFilters, 150)
}, { deep: true })

/* ------------- Données mock ------------- */
function mockData () {
  return [
    { id: 1, code: '6A', libelle: '6ème A', niveau: '6', filiere: 'Scientifique', effectif: 42, titulaire: 'M. Kasa' },
    { id: 2, code: '1L', libelle: '1ère L', niveau: '1', filiere: 'Littéraire',    effectif: 35, titulaire: 'Mme Tumba' },
    { id: 3, code: '6B', libelle: '6ème B', niveau: '6', filiere: 'Scientifique',  effectif: 40, titulaire: 'M. Ilunga' }
  ]
}

load()
</script>
