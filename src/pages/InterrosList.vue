<!-- pages/InterrosList.vue -->
<template>
  <AppLayout>
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
            list="cours-list"
          />
          <datalist id="cours-list">
            <option v-for="c in coursOptions" :key="c" :value="c" />
          </datalist>

          <input
            v-model="filters.classe"
            class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                   text-gray-900 shadow-sm placeholder-gray-500
                   focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                   dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400
                   dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
            placeholder="Classe…"
            list="classe-list"
          />
          <datalist id="classe-list">
            <option v-for="cl in classeOptions" :key="cl" :value="cl" />
          </datalist>

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
        <div class="rounded-xl border border-gray-200 bg-white p-3 shadow-sm
                    dark:border-gray-700 dark:bg-gray-900">
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
                list="cours-list"
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
                list="classe-list"
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
  { key: 'titre',  label: 'Titre' },
  { key: 'type',   label: 'Type' },
  { key: 'date',   label: 'Date' },
  { key: 'cours',  label: 'Cours' },
  { key: 'classe', label: 'Classe' },
  { key: 'bareme', label: 'Barème' }
]

// Filtres
const filters = ref({ q: '', cours: '', classe: '', date: '' })
const coursOptions = computed(() => school.uniqueInterroCours)
const classeOptions = computed(() => school.uniqueInterroClasses)

// Normalisation : insensible aux accents/majuscules
function normalize (s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

// Lignes affichées (filtrées) — basé sur le store
const rows = computed(() => {
  const q = normalize(filters.value.q)
  const fCours  = normalize(filters.value.cours)
  const fClasse = normalize(filters.value.classe)
  const fDate   = filters.value.date // YYYY-MM-DD exact

  return school.interros.filter(r => {
    const haystack = normalize(`${r.titre} ${r.type} ${r.date} ${r.cours} ${r.classe} ${r.bareme}`)
    const matchesQ = q ? haystack.includes(q) : true
    const matchesCours  = fCours  ? normalize(r.cours).includes(fCours)   : true
    const matchesClasse = fClasse ? normalize(r.classe).includes(fClasse) : true
    const matchesDate   = fDate   ? r.date === fDate : true
    return matchesQ && matchesCours && matchesClasse && matchesDate
  })
})

// Modal + Form
const modalOpen = ref(false)
const form = ref({ id: null, titre: '', type: 'Programmée', date: '', cours: '', classe: '', bareme: 10 })

function onResetFilters () {
  filters.value = { q: '', cours: '', classe: '', date: '' }
}

function openCreate () {
  form.value = { id: null, titre: '', type: 'Programmée', date: '', cours: '', classe: '', bareme: 10 }
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
  school.addInterro({ ...form.value })
}
function update () {
  school.updateInterro({ ...form.value })
}
function removeRow (r) {
  school.removeInterro(r.id)
}

// pour compat avec le bouton "Filtrer"
function applyFilters () {
  /* rows est un computed, rien à faire ici */
}
</script>
