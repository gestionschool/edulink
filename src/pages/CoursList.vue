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
          <select v-model="filters.professeur"
                  class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                         text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                         dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-400">
            <option value="">Professeur</option>
            <option v-for="p in profOptions" :key="p" :value="p">{{ p }}</option>
          </select>

          <select v-model="filters.classe"
                  class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                         text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                         dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-400">
            <option value="">Classe</option>
            <option v-for="cl in classeOptions" :key="cl" :value="cl">{{ cl }}</option>
          </select>

          <select v-model.number="filters.periodeId"
                  class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                         text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                         dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-400">
            <option :value="''">Période</option>
            <option v-for="p in periodeOptions" :key="p.id" :value="p.id">{{ p.label }}</option>
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
              <input v-model="form.code"
                     class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                            text-gray-900 shadow-sm placeholder-gray-500
                            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                            dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                            dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                     required />
            </label>

            <label class="text-gray-700 dark:text-gray-200">
              Intitulé
              <input v-model="form.intitule"
                     class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                            text-gray-900 shadow-sm placeholder-gray-500
                            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                            dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                            dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                     required />
            </label>

            <label class="text-gray-700 dark:text-gray-200">
              Classe
              <input v-model="form.classe" list="classe-list"
                     class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                            text-gray-900 shadow-sm placeholder-gray-500
                            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                            dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                            dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                     required />
              <datalist id="classe-list">
                <option v-for="cl in classeOptions" :key="cl" :value="cl" />
              </datalist>
            </label>

            <label class="text-gray-700 dark:text-gray-200">
              Professeur
              <input v-model="form.professeur" list="prof-list"
                     class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                            text-gray-900 shadow-sm placeholder-gray-500
                            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                            dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                            dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                     required />
              <datalist id="prof-list">
                <option v-for="p in profOptions" :key="p" :value="p" />
              </datalist>
            </label>

            <label class="text-gray-700 dark:text-gray-200">
              Volume horaire
              <input v-model.number="form.volume" type="number" min="1"
                     class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                            text-gray-900 shadow-sm placeholder-gray-500
                            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                            dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                            dark:focus:border-indigo-400 dark:focus:ring-indigo-400" />
            </label>

            <label class="text-gray-700 dark:text-gray-200">
              Période
              <select v-model.number="form.periodeId"
                      class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                             text-gray-900 shadow-sm
                             focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                             dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100
                             dark:focus:border-indigo-400 dark:focus:ring-indigo-400">
                <option :value="null">—</option>
                <option v-for="p in periodeOptions" :key="p.id" :value="p.id">{{ p.label }}</option>
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
  { key: 'code',       label: 'Code' },
  { key: 'intitule',   label: 'Intitulé' },
  { key: 'classe',     label: 'Classe' },
  { key: 'professeur', label: 'Professeur' },
  { key: 'volume',     label: 'Volume h.' },
  { key: 'periode',    label: 'Période' }, // affichage libellé
]

// Filtres
const filters = ref({ q: '', professeur: '', classe: '', periodeId: '' })

// Options
const profOptions    = computed(() => school.uniqueCoursProfesseurs)
const classeOptions  = computed(() => school.uniqueCoursClasses)
const periodeOptions = computed(() => school.periodes) // [{id,label,...}]

// Utils
function normalize (s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
}
const periodeLabel = (id) => school.getPeriodeLabel(id)

// Lignes (affiche libellé de période)
const rows = computed(() => {
  const q  = normalize(filters.value.q)
  const fP = filters.value.professeur
  const fC = filters.value.classe
  const fPe= filters.value.periodeId === '' ? null : Number(filters.value.periodeId)

  return school.cours
    .filter(r => {
      const hay = normalize(`${r.code} ${r.intitule} ${r.classe} ${r.professeur} ${r.volume} ${periodeLabel(r.periodeId)}`)
      const okQ  = q ? hay.includes(q) : true
      const okPr = fP ? r.professeur === fP : true
      const okCl = fC ? r.classe === fC : true
      const okPe = fPe ? r.periodeId === fPe : true
      return okQ && okPr && okCl && okPe
    })
    .map(r => ({
      ...r,
      periode: periodeLabel(r.periodeId), // colonne affichée
    }))
})

// Modal + Form
const modalOpen = ref(false)
const form = ref({ id: null, code: '', intitule: '', classe: '', professeur: '', volume: 0, periodeId: null })

function onResetFilters () {
  filters.value = { q: '', professeur: '', classe: '', periodeId: '' }
}

function openCreate () {
  form.value = { id: null, code: '', intitule: '', classe: '', professeur: '', volume: 0, periodeId: null }
  modalOpen.value = true
}
function openEdit (r) {
  form.value = { id: r.id, code: r.code, intitule: r.intitule, classe: r.classe, professeur: r.professeur, volume: r.volume, periodeId: r.periodeId ?? null }
  modalOpen.value = true
}
function save () {
  form.value.id ? update() : create()
  modalOpen.value = false
}
function create () {
  school.addCours({ ...form.value })
}
function update () {
  school.updateCours({ ...form.value })
}
function removeRow (r) {
  school.removeCours(r.id)
}

// compat bouton "Filtrer" (rows est computed)
function applyFilters () { /* no-op */ }
</script>
