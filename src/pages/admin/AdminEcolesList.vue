<!-- src/pages/AdminEcolesList.vue -->
<template>
    <AppLayout>
        <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <div class="mx-auto max-w-6xl p-4 sm:p-6">
            
                <PageHeader title="Écoles">
                <template #actions>
                    <button 
                        v-if="canManageSchools" 
                        class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white
                    hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
                    dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400"
                     @click="openCreate()">Nouvelle</button>
                </template>
                </PageHeader>


                <FilterBar v-model="filters" @reset="filters={ q:'', pays:'', fuseau:'' }">
                    <input 
                        v-model="filters.pays" 
                        class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                  text-gray-900 shadow-sm placeholder-gray-500
                  focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                  dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400
                  dark:focus:border-indigo-400 dark:focus:ring-indigo-400" 
                        placeholder="Pays…" />
                    <input 
                        v-model="filters.fuseau" 
                        class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                  text-gray-900 shadow-sm placeholder-gray-500
                  focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                  dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400
                  dark:focus:border-indigo-400 dark:focus:ring-indigo-400" 
                        placeholder="Fuseau (ex: Africa/Lubumbashi)"/>
                    <button class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium
                  text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500
                  dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-indigo-400" @click="load()">Filtrer</button>
                </FilterBar>

                <!-- Tableau -->
                <div
                class="rounded-xl border border-gray-200 bg-white p-3 shadow-sm
                        dark:border-gray-700 dark:bg-gray-900"
                >
                    <DataTable :rows="rows" :headers="headers" idKey="id"
                    @edit="openEdit" @remove="removeRow">
                    <!-- (si ton DataTable permet des slots, sinon on garde les boutons intégrés) -->
                    </DataTable>
                </div>

                <CrudModal 
                    :open="modalOpen" 
                    :title="form.id?'Modifier école':'Créer école'"
                    @close="modalOpen=false" 
                    @submit="save"
                >
                    <div class="grid sm:grid-cols-2 gap-3">
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
                                /></label>
                        <label class="text-gray-700 dark:text-gray-200">
                            Pays
                            <input 
                                v-model="form.pays" 
                                class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                                    text-gray-900 shadow-sm placeholder-gray-500
                                    focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                                    dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                                    dark:focus:border-indigo-400 dark:focus:ring-indigo-400" 
                                required
                                /></label>
                        <label class="text-gray-700 dark:text-gray-200">
                            Fuseau horaire
                            <input 
                                v-model="form.fuseau" 
                                class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                        text-gray-900 shadow-sm placeholder-gray-500
                        focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                        dark:focus:border-indigo-400 dark:focus:ring-indigo-400" placeholder="Africa/Lubumbashi" required/></label>
                        <label class="text-gray-700 dark:text-gray-200">
                            Admin (Direction) - email
                            <input 
                                v-model="form.adminEmail" 
                                type="email" 
                                class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                        text-gray-900 shadow-sm placeholder-gray-500
                        focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                        dark:focus:border-indigo-400 dark:focus:ring-indigo-400" required/></label>
                    </div>
                </CrudModal>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAcl } from '@/composables/useAcl'
import PageHeader from '@/components/PageHeader.vue'
import FilterBar from '@/components/FilterBar.vue'
import DataTable from '@/components/DataTable.vue'
import CrudModal from '@/components/CrudModal.vue'
import AppLayout from '@/components/layout/AppLayout.vue'

const { canManageSchools } = useAcl()

const headers = [
  { key:'nom',label:'Nom' }, { key:'pays',label:'Pays' },
  { key:'fuseau',label:'Fuseau' }, { key:'adminEmail',label:'Admin (Direction)' }
]

const filters = ref({ q:'', pays:'', fuseau:'' })
const rows = ref([])
const modalOpen = ref(false)
const form = ref({ id:null, nom:'', pays:'', fuseau:'Africa/Lubumbashi', adminEmail:'' })

function load () { rows.value = mockData().filter(applyFilters) }
function applyFilters (r) {
  const q = (filters.value.q || '').toLowerCase()
  const okQ = !q || [r.nom, r.pays, r.fuseau, r.adminEmail].some(v => String(v).toLowerCase().includes(q))
  const okPays = !filters.value.pays || r.pays === filters.value.pays
  const okFus = !filters.value.fuseau || r.fuseau.includes(filters.value.fuseau)
  return okQ && okPays && okFus
}
function openCreate(){ form.value={ id:null, nom:'', pays:'', fuseau:'Africa/Lubumbashi', adminEmail:'' }; modalOpen.value=true }
function openEdit(r){ if(!canManageSchools.value) return; form.value={...r}; modalOpen.value=true }
async function save(){ if(!canManageSchools.value) return; form.value.id?update():create(); modalOpen.value=false; load() }
async function create(){} async function update(){} 
async function removeRow(r){ if(!canManageSchools.value) return; rows.value=rows.value.filter(x=>x.id!==r.id) }

function mockData() {
  return [
    { 
        id: 1, 
        nom: 'Lycée Mwamba', 
        pays: 'RDC', 
        fuseau:'Africa/Lubumbashi', 
        adminEmail:'direction@mwamba.edu' 
    },
    { 
        id: 2, 
        nom: 'Collège Saint Michel', 
        pays: 'RDC', 
        fuseau:'Africa/Kinshasa', 
        adminEmail:'admin@saintmichel.edu' 
    },
    { 
        id: 3, 
        nom: 'École Internationale de Kinshasa', 
        pays: 'RDC', 
        fuseau:'Africa/Kinshasa', 
        adminEmail:'contact@eikin.edu' 
    },
    { 
        id: 4, 
        nom: 'Lycée Français de Lubumbashi', 
        pays: 'RDC', 
        fuseau:'Africa/Lubumbashi', 
        adminEmail:'direction@lyceefrancais.edu' 
    },
    { 
        id: 5, 
        nom: 'École Belge de Kinshasa', 
        pays: 'RDC', 
        fuseau:'Africa/Kinshasa', 
        adminEmail:'info@ecolebelge.edu' 
    },
    { 
        id: 6, 
        nom: 'Institut Maman Diange', 
        pays: 'RDC', 
        fuseau:'Africa/Lubumbashi', 
        adminEmail:'admin@mamandiange.edu' 
    },
    { 
        id: 7, 
        nom: 'École Privée Les Petits Génies', 
        pays: 'RDC', 
        fuseau:'Africa/Kinshasa', 
        adminEmail:'contact@petitsgenies.edu' 
    },
    { 
        id: 8, 
        nom: 'Lycée Technique de Goma', 
        pays: 'RDC', 
        fuseau:'Africa/Goma', 
        adminEmail:'direction@lyceetech.edu' 
    },
    { 
        id: 9, 
        nom: 'École Moderne de Bukavu', 
        pays: 'RDC', 
        fuseau:'Africa/Bukavu', 
        adminEmail:'admin@ecolemoderne.edu' 
    },
  ]
}
load()
</script>
