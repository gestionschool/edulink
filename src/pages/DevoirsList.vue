<!-- pages/DevoirsList.vue -->
<template>
  <AppLayout>
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
            list="cours-list"
            class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                   text-gray-900 shadow-sm placeholder-gray-500
                   focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                   dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400
                   dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
          />
          <datalist id="cours-list">
            <option v-for="c in coursOptions" :key="c" :value="c" />
          </datalist>

          <input
            v-model="filters.classe"
            placeholder="Classe…"
            list="classe-list"
            class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                   text-gray-900 shadow-sm placeholder-gray-500
                   focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                   dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400
                   dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
          />
          <datalist id="classe-list">
            <option v-for="cl in classeOptions" :key="cl" :value="cl" />
          </datalist>

          <select
            v-model="filters.periode"
            class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                   text-gray-900 shadow-sm
                   focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                   dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
                   dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
          >
            <option value="">Période</option>
            <option v-for="p in periodeOptions" :key="p" :value="p">{{ p }}</option>
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
            <option v-for="s in statutOptions" :key="s" :value="s">{{ s }}</option>
          </select>

          <!-- bouton pour compat, le filtrage est réactif -->
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

            <label class="text-gray-700 dark:text-gray-200">
              Période
              <select
                v-model="form.periode"
                class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                       text-gray-900 shadow-sm
                       focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                       dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100
                       dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
              >
                <option value="">—</option>
                <option v-for="p in periodeOptions" :key="p" :value="p">{{ p }}</option>
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
  { key: 'titre',      label: 'Titre' },
  { key: 'cours',      label: 'Cours' },
  { key: 'classe',     label: 'Classe' },
  { key: 'dateRemise', label: 'Remise' },
  { key: 'bareme',     label: 'Barème' },
  { key: 'statut',     label: 'Statut' }
]

// Filtres
const filters = ref({ q: '', cours: '', classe: '', periode: '', statut: '' })

// Options issues du store
const coursOptions   = computed(() => school.uniqueDevoirCours)
const classeOptions  = computed(() => school.uniqueDevoirClasses)
const periodeOptions = computed(() => school.uniqueDevoirPeriodes)
const statutOptions  = computed(() => school.uniqueDevoirStatuts)

// Normalisation : insensible aux accents/majuscules
function normalize (s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

// Lignes filtrées depuis le store
const rows = computed(() => {
  const q        = normalize(filters.value.q)
  const fCours   = normalize(filters.value.cours)
  const fClasse  = normalize(filters.value.classe)
  const fPeriode = filters.value.periode
  const fStatut  = filters.value.statut

  return school.devoirs.filter(r => {
    const hay = normalize(`${r.titre} ${r.cours} ${r.classe} ${r.dateRemise} ${r.bareme} ${r.statut} ${r.periode || ''}`)
    const okQ       = q ? hay.includes(q) : true
    const okCours   = fCours ? normalize(r.cours).includes(fCours) : true
    const okClasse  = fClasse ? normalize(r.classe).includes(fClasse) : true
    const okPeriode = fPeriode ? r.periode === fPeriode : true
    const okStatut  = fStatut ? r.statut === fStatut : true
    return okQ && okCours && okClasse && okPeriode && okStatut
  })
})

// Modal + Form
const modalOpen = ref(false)
const form = ref({ id: null, titre: '', cours: '', classe: '', dateRemise: '', bareme: 20, statut: 'Publié', periode: '' })

function onResetFilters () {
  filters.value = { q: '', cours: '', classe: '', periode: '', statut: '' }
}

function openCreate () {
  form.value = { id: null, titre: '', cours: '', classe: '', dateRemise: '', bareme: 20, statut: 'Publié', periode: '' }
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
  school.addDevoir({ ...form.value })
}
function update () {
  school.updateDevoir({ ...form.value })
}
function removeRow (r) {
  school.removeDevoir(r.id)
}

// compat bouton "Filtrer" (rows est computed)
function applyFilters () { /* no-op */ }
</script>
