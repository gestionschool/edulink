<!-- pages/InterrosList.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <div class="mx-auto max-w-6xl p-4 sm:p-6">
      <PageHeader title="Interrogations">
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
        <input
          v-model="filters.cours"
          class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                 text-gray-900 shadow-sm placeholder-gray-500
                 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400
                 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
          placeholder="Cours…"
        />
        <input
          v-model="filters.classe"
          class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                 text-gray-900 shadow-sm placeholder-gray-500
                 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400
                 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
          placeholder="Classe…"
        />
        <input
          v-model="filters.date"
          type="date"
          class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                 text-gray-900 shadow-sm
                 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
                 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
        />

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
        :title="form.id ? 'Modifier interrogation' : 'Créer interrogation'"
        @close="modalOpen=false"
        @submit="save"
      >
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="text-gray-700 dark:text-gray-200">
            Titre
            <input
              v-model="form.titre"
              class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                     text-gray-900 shadow-sm placeholder-gray-500
                     focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                     dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                     dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
              required
            />
          </label>

          <label class="text-gray-700 dark:text-gray-200">
            Type
            <select
              v-model="form.type"
              class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                     text-gray-900 shadow-sm
                     focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                     dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100
                     dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
            >
              <option>Surprise</option>
              <option>Programmée</option>
            </select>
          </label>

          <label class="text-gray-700 dark:text-gray-200">
            Date
            <input
              v-model="form.date"
              type="date"
              class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                     text-gray-900 shadow-sm
                     focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                     dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100
                     dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
              required
            />
          </label>

          <label class="text-gray-700 dark:text-gray-200">
            Cours
            <input
              v-model="form.cours"
              class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                     text-gray-900 shadow-sm placeholder-gray-500
                     focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                     dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                     dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
              required
            />
          </label>

          <label class="text-gray-700 dark:text-gray-200">
            Classe
            <input
              v-model="form.classe"
              class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                     text-gray-900 shadow-sm placeholder-gray-500
                     focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                     dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                     dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
              required
            />
          </label>

          <label class="text-gray-700 dark:text-gray-200">
            Barème
            <input
              v-model.number="form.bareme"
              type="number"
              min="1"
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
  { key: 'titre',  label: 'Titre' },
  { key: 'type',   label: 'Type' },
  { key: 'date',   label: 'Date' },
  { key: 'cours',  label: 'Cours' },
  { key: 'classe', label: 'Classe' },
  { key: 'bareme', label: 'Barème' }
]

// Filtres
const filters = ref({ q: '', cours: '', classe: '', date: '' })

// Données
const allRows = ref([])
const rows = ref([])

// Modal + Form
const modalOpen = ref(false)
const form = ref({ id: null, titre: '', type: 'Programmée', date: '', cours: '', classe: '', bareme: 10 })

/* -------- CRUD/mock + load -------- */
function load () {
  allRows.value = mockData()
  applyFilters()
}
function openCreate () {
  form.value = { id: null, titre: '', type: 'Programmée', date: '', cours: '', classe: '', bareme: 10 }
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
async function create () { /* POST /interros */ }
async function update () { /* PUT  /interros/:id */ }
async function removeRow (r) {
  // DELETE /interros/:id
  allRows.value = allRows.value.filter(x => x.id !== r.id)
  applyFilters()
}

/* ------------- Filtres ------------- */
function onResetFilters () {
  filters.value = { q: '', cours: '', classe: '', date: '' }
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
  const fCours = normalize(filters.value.cours)
  const fClasse = normalize(filters.value.classe)
  const fDate = filters.value.date // YYYY-MM-DD

  rows.value = allRows.value.filter(r => {
    // Recherche plein-texte sur plusieurs champs
    const haystack = normalize(`${r.titre} ${r.type} ${r.date} ${r.cours} ${r.classe} ${r.bareme}`)
    const matchesQ = q ? haystack.includes(q) : true

    // Spécifiques
    const matchesCours = fCours ? normalize(r.cours).includes(fCours) : true
    const matchesClasse = fClasse ? normalize(r.classe).includes(fClasse) : true
    const matchesDate = fDate ? r.date === fDate : true

    return matchesQ && matchesCours && matchesClasse && matchesDate
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
    { id: 1, titre: 'Interro dérivées',      type: 'Surprise',   date: '2025-10-03', cours: 'Math',     classe: '6ème A', bareme: 10 },
    { id: 2, titre: 'Interro vocabulaire',   type: 'Programmée', date: '2025-10-06', cours: 'Français', classe: '6ème B', bareme: 10 },
    { id: 3, titre: 'Interro énergie',       type: 'Programmée', date: '2025-10-10', cours: 'Physique', classe: '6ème A', bareme: 20 }
  ]
}

load()
</script>
