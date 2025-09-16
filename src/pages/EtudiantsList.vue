<!-- pages/EtudiantsList.vue -->
<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div class="mx-auto max-w-6xl p-4 sm:p-6">
        <PageHeader title="Étudiants">
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
            v-model="filters.classe"
            class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                   text-gray-900 shadow-sm
                   focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                   dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
                   dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
          >
            <option value="">Classe</option>
            <option v-for="c in classeOptions" :key="c" :value="c">{{ c }}</option>
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
            <option>Suspendu</option>
          </select>

          <button
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium
                   text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500
                   dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-indigo-400"
            @click="noop"
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
          >
            <!-- Colonne Actions personnalisée -->
            <template #actions-extra="{ row }">
              <div class="flex gap-2">
                <button
                  class="mr-2 inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium
                     text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500
                     dark:text-blue-400 dark:focus:ring-blue-400"
                  @click="openBulletin(row)"
                >
                  Bulletin
                </button>
              </div>
            </template>
          </DataTable>
        </div>

        <!-- Modal CRUD -->
        <CrudModal
          :open="modalOpen"
          :title="form.id ? 'Modifier étudiant' : 'Créer étudiant'"
          @close="modalOpen=false"
          @submit="save"
        >
          <div class="grid gap-3 sm:grid-cols-2">
            <label class="text-gray-700 dark:text-gray-200">
              Matricule
              <input
                v-model="form.matricule"
                class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                       text-gray-900 shadow-sm placeholder-gray-500
                       focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                       dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                       dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                required
              />
            </label>

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
              Prénom
              <input
                v-model="form.prenom"
                class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                       text-gray-900 shadow-sm placeholder-gray-500
                       focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                       dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                       dark:focus;border-indigo-400 dark:focus:ring-indigo-400"
                required
              />
            </label>

            <label class="text-gray-700 dark:text-gray-200">
              Classe
              <select
                v-model="form.classe"
                class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                       text-gray-900 shadow-sm
                       focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                       dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100
                       dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                required
              >
                <option disabled value="">— choisir —</option>
                <option v-for="c in classeOptions" :key="`form-${c}`" :value="c">{{ c }}</option>
              </select>
            </label>

            <label class="text-gray-700 dark:text-gray-200">
              Tuteur
              <input
                v-model="form.tuteur"
                class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                       text-gray-900 shadow-sm placeholder-gray-500
                       focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                       dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                       dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
              />
            </label>

            <label class="text-gray-700 dark:text-gray-200">
              Téléphone
              <input
                v-model="form.telephone"
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
                       dark:focus;border-indigo-400 dark:focus:ring-indigo-400"
              >
                <option>Actif</option>
                <option>Suspendu</option>
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
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useSchoolStore } from '@/stores/school'

import PageHeader from '@/components/PageHeader.vue'
import FilterBar from '@/components/FilterBar.vue'
import DataTable from '@/components/DataTable.vue'
import CrudModal from '@/components/CrudModal.vue'
import AppLayout from '@/components/layout/AppLayout.vue'

/* ================= colonnes ================= */
const headers = [
  { key: 'matricule', label: 'Matricule' },
  { key: 'nom',       label: 'Nom' },
  { key: 'prenom',    label: 'Prénom' },
  { key: 'classe',    label: 'Classe' },
  { key: 'tuteur',    label: 'Tuteur' },
  { key: 'telephone', label: 'Téléphone' },
  { key: 'statut',    label: 'Statut' },
  { key: '_actions',  label: 'Actions' } // colonne pour “Bulletin”
]

/* ================= store ================= */
const school = useSchoolStore()
const { students, classes, uniqueStudentClasses, periodes } = storeToRefs(school)

/* IDs <-> labels */
const classeIdToLabel = computed(() =>
  Object.fromEntries(classes.value.map(c => [c.id, c.label]))
)
const labelToClasseId = computed(() =>
  Object.fromEntries(classes.value.map(c => [c.label, c.id]))
)

/* Options de filtre / sélecteur */
const classeOptions = computed(() => uniqueStudentClasses.value)

/* ================= filtres ================= */
const filters = ref({ q: '', classe: '', statut: '' })

/* Normalisation recherche */
function normalize (s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

/* ================= donnée vue (dénormalisée) ================= */
const sourceRows = computed(() =>
  students.value.map(s => ({
    id: s.id,
    matricule: s.matricule || '',
    nom: s.nom || '',
    prenom: s.prenom || '',
    classe: classeIdToLabel.value[s.classeId] || s.classe || '',
    tuteur: s.tuteur || '',
    telephone: s.telephone || '',
    statut: s.statut || 'Actif'
  }))
)

/* ================= filtrage réactif ================= */
const rows = computed(() => {
  const q = normalize(filters.value.q)
  const fClasse = filters.value.classe
  const fStatut = filters.value.statut

  return sourceRows.value.filter(r => {
    const haystack = normalize(`${r.matricule} ${r.nom} ${r.prenom} ${r.classe} ${r.tuteur} ${r.telephone} ${r.statut}`)
    const matchesQ = q ? haystack.includes(q) : true
    const matchesClasse = fClasse ? r.classe === fClasse : true
    const matchesStatut = fStatut ? r.statut === fStatut : true
    return matchesQ && matchesClasse && matchesStatut
  })
})

function onResetFilters () {
  filters.value = { q: '', classe: '', statut: '' }
}
function noop(){}

/* ================= modal / form ================= */
const modalOpen = ref(false)
const form = ref({
  id: null,
  matricule: '',
  nom: '',
  prenom: '',
  classe: '',     // label (converti en classeId au save)
  tuteur: '',
  telephone: '',
  statut: 'Actif'
})

function openCreate () {
  form.value = { id: null, matricule: '', nom: '', prenom: '', classe: '', tuteur: '', telephone: '', statut: 'Actif' }
  modalOpen.value = true
}
function openEdit (r) {
  form.value = { ...r }
  modalOpen.value = true
}

async function save () {
  const payload = { ...form.value }
  const classeId = labelToClasseId.value[payload.classe] ?? null

  if (payload.id) {
    school.updateEtudiant({ id: payload.id, ...payload, classeId })
  } else {
    const newId = school.addEtudiant({ ...payload, classeId })
    form.value.id = newId
  }
  modalOpen.value = false
}

async function removeRow (r) {
  school.removeEtudiant(r.id)
}

/* ================= Lien vers Bulletin ================= */
const router = useRouter()
const currentPeriodeId = computed(() =>
  periodes.value.find(p => p.active)?.id ?? periodes.value[0]?.id ?? null
)

function openBulletin (row) {
  if (!row?.id || !currentPeriodeId.value) return
  router.push({ name: 'bulletin', params: { eleveId: row.id, periodeId: currentPeriodeId.value } })
}
</script>
