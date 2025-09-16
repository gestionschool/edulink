<!-- src/pages/ClassesList.vue (branchée au store local) -->
<template>
  <AppLayout>
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
          <select v-model="filters.niveau" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                          text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                          dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
                          dark:focus:border-indigo-400 dark:focus:ring-indigo-400">
            <option value="">Niveau</option>
            <option v-for="n in niveaux" :key="n" :value="String(n)">{{ n }}</option>
          </select>

          <select v-model="filters.filiere" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                           text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                           dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
                           dark:focus:border-indigo-400 dark:focus:ring-indigo-400">
            <option value="">Filière/Option</option>
            <option v-for="f in filieres" :key="f" :value="f">{{ f }}</option>
          </select>

          <button class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium
                         text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500
                         dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-indigo-400"
                  @click="applyFilters">
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
          :title="form.id ? 'Modifier classe' : 'Créer classe'"
          @close="modalOpen=false"
          @submit="save"
        >
          <div class="grid gap-3 sm:grid-cols-2">
            <label class="text-gray-700 dark:text-gray-200">
              Code
              <input v-model="form.code" required
                     class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                            text-gray-900 shadow-sm placeholder-gray-500
                            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                            dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                            dark:focus:border-indigo-400 dark:focus:ring-indigo-400"/>
            </label>
            <label class="text-gray-700 dark:text-gray-200">
              Libellé
              <input v-model="form.libelle" required
                     class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                            text-gray-900 shadow-sm placeholder-gray-500
                            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                            dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                            dark:focus:border-indigo-400 dark:focus:ring-indigo-400"/>
            </label>
            <label class="text-gray-700 dark:text-gray-200">
              Niveau
              <input v-model="form.niveau"
                     class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                            text-gray-900 shadow-sm placeholder-gray-500
                            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                            dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                            dark:focus:border-indigo-400 dark:focus:ring-indigo-400"/>
            </label>
            <label class="text-gray-700 dark:text-gray-200">
              Filière/Option
              <input v-model="form.filiere"
                     class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                            text-gray-900 shadow-sm placeholder-gray-500
                            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                            dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                            dark:focus:border-indigo-400 dark:focus:ring-indigo-400"/>
            </label>
            <label class="text-gray-700 dark:text-gray-200">
              Effectif
              <input v-model.number="form.effectif" type="number" min="0"
                     class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                            text-gray-900 shadow-sm placeholder-gray-500
                            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                            dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                            dark:focus:border-indigo-400 dark:focus:ring-indigo-400"/>
            </label>
            <label class="text-gray-700 dark:text-gray-200">
              Titulaire
              <input v-model="form.titulaire"
                     class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                            text-gray-900 shadow-sm placeholder-gray-500
                            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                            dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                            dark:focus:border-indigo-400 dark:focus:ring-indigo-400"/>
            </label>
          </div>
        </CrudModal>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useSchoolStore } from '@/stores/school'
import PageHeader from '@/components/PageHeader.vue'
import FilterBar from '@/components/FilterBar.vue'
import DataTable from '@/components/DataTable.vue'
import CrudModal from '@/components/CrudModal.vue'
import AppLayout from '@/components/layout/AppLayout.vue'

const school = useSchoolStore()

const headers = [
  { key: 'code',     label: 'Code' },
  { key: 'libelle',  label: 'Libellé' },
  { key: 'niveau',   label: 'Niveau' },
  { key: 'filiere',  label: 'Filière' },
  { key: 'effectif', label: 'Effectif' },
  { key: 'titulaire',label: 'Titulaire' }
]

// options dynamiques
const niveaux  = computed(() => school.uniqueClasseNiveaux)
const filieres = computed(() => school.uniqueClasseFilieres)

// Filtres
const filters = ref({ q: '', niveau: '', filiere: '' })

// Données (vue dénormalisée depuis le store)
const allRows = computed(() => school.classesView)

// Filtrage local
function normalize (s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
}
function apply (r) {
  const q = normalize(filters.value.q)
  const okQ = !q || normalize(`${r.code} ${r.libelle} ${r.niveau} ${r.filiere} ${r.titulaire}`).includes(q)
  const okN = !filters.value.niveau || String(r.niveau) === String(filters.value.niveau)
  const okF = !filters.value.filiere || r.filiere === filters.value.filiere
  return okQ && okN && okF
}
const rows = computed(() => allRows.value.filter(apply))
function onResetFilters () { filters.value = { q:'', niveau:'', filiere:'' } }
function applyFilters () {/* no-op: filtres réactifs */}

// Modal + Form
const modalOpen = ref(false)
const form = ref({ id:null, code:'', libelle:'', niveau:'', filiere:'', effectif:0, titulaire:'' })

function openCreate () {
  form.value = { id:null, code:'', libelle:'', niveau:'', filiere:'', effectif:0, titulaire:'' }
  modalOpen.value = true
}
function openEdit (r) {
  form.value = { ...r }
  modalOpen.value = true
}
async function save () {
  if (form.value.id) school.updateClasse({ ...form.value })
  else school.addClasse({ ...form.value })
  modalOpen.value = false
}
function removeRow (r) {
  school.removeClasse(r.id)
}

// (optionnel) si tu veux refermer le modal quand le store change
watch(() => school.classesView.length, () => { /* could refresh */ })
</script>
