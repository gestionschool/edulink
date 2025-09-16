<!-- pages/CoursList.vue -->
<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div class="mx-auto max-w-6xl p-4 sm:p-6">
        <PageHeader title="Cours">
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
            v-model="filters.professeur"
            class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                  text-gray-900 shadow-sm
                  focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                  dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
                  dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
          >
            <option value="">Professeur</option>
            <option>Kabeya</option>
            <option>Ngoma</option>
          </select>

          <select
            v-model="filters.classe"
            class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                  text-gray-900 shadow-sm
                  focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                  dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
                  dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
          >
            <option value="">Classe</option>
            <option>6ème A</option>
            <option>6ème B</option>
          </select>

          <select
            v-model="filters.periode"
            class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                  text-gray-900 shadow-sm
                  focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                  dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
                  dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
          >
            <option value="">Période</option>
            <option>Trimestre 1</option>
            <option>Trimestre 2</option>
            <option>Trimestre 3</option>
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
          :title="form.id ? 'Modifier cours' : 'Créer cours'"
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
              Intitulé
              <input
                v-model="form.intitule"
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
              Professeur
              <input
                v-model="form.professeur"
                class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                      text-gray-900 shadow-sm placeholder-gray-500
                      focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                      dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                      dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                required
              />
            </label>
            <label class="text-gray-700 dark:text-gray-200">
              Volume horaire
              <input
                v-model.number="form.volume"
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
              Période
              <input
                v-model="form.periode"
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
  </AppLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import FilterBar from '@/components/FilterBar.vue'
import DataTable from '@/components/DataTable.vue'
import CrudModal from '@/components/CrudModal.vue'
import AppLayout from '@/components/layout/AppLayout.vue'

const headers = [
  { key: 'code',       label: 'Code' },
  { key: 'intitule',   label: 'Intitulé' },
  { key: 'classe',     label: 'Classe' },
  { key: 'professeur', label: 'Professeur' },
  { key: 'volume',     label: 'Volume h.' },
  { key: 'periode',    label: 'Période' }
]

// Filtres
const filters = ref({ q: '', professeur: '', classe: '', periode: '' })

// Données
const allRows = ref([])
const rows = ref([])

// Modal + Form
const modalOpen = ref(false)
const form = ref({ id: null, code: '', intitule: '', classe: '', professeur: '', volume: 0, periode: '' })

/* -------- CRUD/mock + load -------- */
function load () {
  allRows.value = mockData()
  applyFilters()
}
function openCreate () {
  form.value = { id: null, code: '', intitule: '', classe: '', professeur: '', volume: 0, periode: '' }
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
async function create () { /* POST /cours */ }
async function update () { /* PUT  /cours/:id */ }
async function removeRow (r) {
  // DELETE /cours/:id
  allRows.value = allRows.value.filter(x => x.id !== r.id)
  applyFilters()
}

/* ------------- Filtres ------------- */
function onResetFilters () {
  filters.value = { q: '', professeur: '', classe: '', periode: '' }
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
  const fProf = filters.value.professeur
  const fClasse = filters.value.classe
  const fPeriode = filters.value.periode

  rows.value = allRows.value.filter(r => {
    // recherche plein-texte (code, intitulé, classe, professeur, période, volume)
    const haystack = normalize(`${r.code} ${r.intitule} ${r.classe} ${r.professeur} ${r.periode} ${r.volume}`)
    const matchesQ = q ? haystack.includes(q) : true
    const matchesProf = fProf ? r.professeur === fProf : true
    const matchesClasse = fClasse ? r.classe === fClasse : true
    const matchesPeriode = fPeriode ? r.periode === fPeriode : true
    return matchesQ && matchesProf && matchesClasse && matchesPeriode
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
    { id: 1, code: 'MAT101', intitule: 'Math Générales', classe: '6ème A', professeur: 'Kabeya', volume: 48, periode: 'Trimestre 1' },
    { id: 2, code: 'PHY102', intitule: 'Physique I',     classe: '6ème B', professeur: 'Ngoma',  volume: 36, periode: 'Trimestre 1' },
    { id: 3, code: 'FRN103', intitule: 'Français Oral',  classe: '6ème A', professeur: 'Kabeya', volume: 24, periode: 'Trimestre 2' }
  ]
}

load()
</script>
