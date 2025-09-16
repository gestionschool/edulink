<!-- pages/DevoirsList.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <div class="mx-auto max-w-6xl p-4 sm:p-6">
      <PageHeader title="Devoirs">
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
        <input
          v-model="filters.cours"
          placeholder="Cours…"
          class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                 text-gray-900 shadow-sm placeholder-gray-500
                 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400
                 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
        />
        <input
          v-model="filters.classe"
          placeholder="Classe…"
          class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                 text-gray-900 shadow-sm placeholder-gray-500
                 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400
                 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
        />
        <select
          v-model="filters.periode"
          class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                 text-gray-900 shadow-sm
                 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
                 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
        >
          <option value="">Période</option>
          <option>T1</option>
          <option>T2</option>
          <option>T3</option>
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
          <option>Publié</option>
          <option>Archivé</option>
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
        :title="form.id ? 'Modifier devoir' : 'Créer devoir'"
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
            Date de remise
            <input
              v-model="form.dateRemise"
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
              <option>Publié</option>
              <option>Archivé</option>
            </select>
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
  { key: 'titre',      label: 'Titre' },
  { key: 'cours',      label: 'Cours' },
  { key: 'classe',     label: 'Classe' },
  { key: 'dateRemise', label: 'Remise' },
  { key: 'bareme',     label: 'Barème' },
  { key: 'statut',     label: 'Statut' }
]

// Filtres
const filters = ref({ q: '', cours: '', classe: '', periode: '', statut: '' })

// Données
const allRows = ref([])
const rows = ref([])

// Modal + Form
const modalOpen = ref(false)
const form = ref({ id: null, titre: '', cours: '', classe: '', dateRemise: '', bareme: 20, statut: 'Publié' })

/* -------- CRUD/mock + load -------- */
function load () {
  allRows.value = mockData()
  applyFilters()
}
function openCreate () {
  form.value = { id: null, titre: '', cours: '', classe: '', dateRemise: '', bareme: 20, statut: 'Publié' }
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
async function create () { /* POST /devoirs */ }
async function update () { /* PUT  /devoirs/:id */ }
async function removeRow (r) {
  // DELETE /devoirs/:id
  allRows.value = allRows.value.filter(x => x.id !== r.id)
  applyFilters()
}

/* ------------- Filtres ------------- */
function onResetFilters () {
  filters.value = { q: '', cours: '', classe: '', periode: '', statut: '' }
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
  const fPeriode = filters.value.periode
  const fStatut = filters.value.statut

  rows.value = allRows.value.filter(r => {
    // Recherche plein-texte sur plusieurs champs :
    const haystack = normalize(`${r.titre} ${r.cours} ${r.classe} ${r.dateRemise} ${r.bareme} ${r.statut} ${r.periode || ''}`)
    const matchesQ = q ? haystack.includes(q) : true

    // Filtres spécifiques :
    const matchesCours = fCours ? normalize(r.cours).includes(fCours) : true
    const matchesClasse = fClasse ? normalize(r.classe).includes(fClasse) : true
    const matchesPeriode = fPeriode ? (r.periode === fPeriode) : true
    const matchesStatut = fStatut ? (r.statut === fStatut) : true

    return matchesQ && matchesCours && matchesClasse && matchesPeriode && matchesStatut
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
    { id: 1, titre: 'DM1 - Fonctions',   cours: 'Math',    classe: '6ème A', dateRemise: '2025-10-05', bareme: 20, statut: 'Publié',  periode: 'T1' },
    { id: 2, titre: 'TP – Cinématique',  cours: 'Physique',classe: '6ème A', dateRemise: '2025-10-10', bareme: 20, statut: 'Publié',  periode: 'T1' },
    { id: 3, titre: 'Rédaction 1',       cours: 'Français',classe: '6ème B', dateRemise: '2025-11-02', bareme: 10, statut: 'Archivé', periode: 'T2' }
  ]
}

load()
</script>
