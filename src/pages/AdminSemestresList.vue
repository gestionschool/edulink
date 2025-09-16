<!-- pages/SemestresList.vue -->
<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div class="mx-auto max-w-6xl p-4 sm:p-6">
        <PageHeader title="Semestres">
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
            v-model="filters.annee"
            placeholder="Année scolaire…"
            class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                  text-gray-900 shadow-sm placeholder-gray-500
                  focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                  dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400
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
          :title="form.id ? 'Modifier semestre' : 'Créer semestre'"
          @close="modalOpen=false"
          @submit="save"
        >
          <div class="grid gap-3 sm:grid-cols-2">
            <label class="text-gray-700 dark:text-gray-200">
              Semestre
              <select
                v-model="form.semestre"
                class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                      text-gray-900 shadow-sm
                      focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                      dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100
                      dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
              >
                <option>S1</option>
                <option>S2</option>
              </select>
            </label>

            <label class="text-gray-700 dark:text-gray-200">
              Année
              <input
                v-model="form.annee"
                class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                      text-gray-900 shadow-sm placeholder-gray-500
                      focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                      dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                      dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                required
              />
            </label>

            <label class="text-gray-700 dark:text-gray-200">
              Début
              <input
                v-model="form.dateDebut"
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
              Fin
              <input
                v-model="form.dateFin"
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
              État
              <select
                v-model="form.etat"
                class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                      text-gray-900 shadow-sm
                      focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                      dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100
                      dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
              >
                <option>Ouvert</option>
                <option>Clos</option>
              </select>
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
  { key:'semestre',  label:'Semestre' },
  { key:'annee',     label:'Année' },
  { key:'dateDebut', label:'Début' },
  { key:'dateFin',   label:'Fin' },
  { key:'etat',      label:'État' }
]

// Filtres
const filters = ref({ q:'', annee:'' })

// Données
const allRows = ref([])
const rows = ref([])

// Modal + Form
const modalOpen = ref(false)
const form = ref({ id:null, semestre:'S1', annee:'', dateDebut:'', dateFin:'', etat:'Ouvert' })

/* -------- CRUD/mock + load -------- */
function load () {
  allRows.value = mockData()
  applyFilters()
}
function openCreate () {
  form.value = { id:null, semestre:'S1', annee:'', dateDebut:'', dateFin:'', etat:'Ouvert' }
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
async function create () { /* POST /semestres */ }
async function update () { /* PUT  /semestres/:id */ }
async function removeRow (r) {
  // DELETE /semestres/:id
  allRows.value = allRows.value.filter(x => x.id !== r.id)
  applyFilters()
}

/* ------------- Filtres ------------- */
function onResetFilters () {
  filters.value = { q:'', annee:'' }
  applyFilters()
}

// Normalisation (case/accents)
function normalize (s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

function applyFilters () {
  const q = normalize(filters.value.q)
  const fAnnee = normalize(filters.value.annee)

  rows.value = allRows.value.filter(r => {
    const haystack = normalize(`${r.semestre} ${r.annee} ${r.dateDebut} ${r.dateFin} ${r.etat}`)
    const matchesQ = q ? haystack.includes(q) : true
    const matchesAnnee = fAnnee ? normalize(r.annee).includes(fAnnee) : true
    return matchesQ && matchesAnnee
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
    { id:1, semestre:'S1', annee:'2025-2026', dateDebut:'2025-09-01', dateFin:'2026-01-31', etat:'Ouvert' },
    { id:2, semestre:'S2', annee:'2025-2026', dateDebut:'2026-02-01', dateFin:'2026-06-30', etat:'Clos' }
  ]
}

load()
</script>
