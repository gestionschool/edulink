<!-- src/pages/ExamensList.vue -->
<template>
  <div>
    <PageHeader title="Examens">
      <template #actions>
        <button v-if="canEditPedago" class="btn-primary" @click="openCreate()">Nouveau</button>
      </template>
    </PageHeader>

    <FilterBar v-model="filters" @reset="filters={ q:'', cours:'', classe:'', date:'', session:'' }">
      <input v-model="filters.cours"  class="input" placeholder="Cours…" list="cours-list" />
      <datalist id="cours-list">
        <option v-for="c in coursOptions" :key="c" :value="c" />
      </datalist>

      <input v-model="filters.classe" class="input" placeholder="Classe…" list="classe-list" />
      <datalist id="classe-list">
        <option v-for="cl in classeOptions" :key="cl" :value="cl" />
      </datalist>

      <input v-model="filters.date"   type="date" class="input" />

      <select v-model="filters.session" class="input">
        <option value="">Session</option>
        <option v-for="s in sessionOptions" :key="s" :value="s">{{ s }}</option>
      </select>

      <!-- bouton conservé pour compat : le filtrage est réactif -->
      <button class="btn-outline" @click="applyFilters()">Filtrer</button>
    </FilterBar>

    <DataTable
      :rows="rows"
      :headers="headers"
      idKey="id"
      @edit="openEdit"
      @remove="removeRow"
    />

    <CrudModal
      :open="modalOpen"
      :title="form.id?'Modifier examen':'Créer examen'"
      @close="modalOpen=false"
      @submit="save"
    >
      <div class="grid sm:grid-cols-2 gap-3">
        <label>Titre
          <input v-model="form.titre" class="input" required/>
        </label>

        <label>Type
          <select v-model="form.type" class="input">
            <option>Final</option>
            <option>Partiel</option>
          </select>
        </label>

        <label>Date
          <input v-model="form.date" type="date" class="input" required/>
        </label>

        <label>Cours
          <input v-model="form.cours" class="input" list="cours-list" required/>
        </label>

        <label>Classe
          <input v-model="form.classe" class="input" list="classe-list" required/>
        </label>

        <label>Barème
          <input v-model.number="form.bareme" type="number" class="input" min="1"/>
        </label>

        <label>Session
          <select v-model="form.session" class="input">
            <option>Normale</option>
            <option>Rattrapage</option>
          </select>
        </label>
      </div>
    </CrudModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAcl } from '@/composables/useAcl'
import { useSchoolStore } from '@/stores/school'
import PageHeader from '@/components/PageHeader.vue'
import FilterBar from '@/components/FilterBar.vue'
import DataTable from '@/components/DataTable.vue'
import CrudModal from '@/components/CrudModal.vue'

const { canEditPedago } = useAcl()
const school = useSchoolStore()

const headers = [
  { key:'titre',  label:'Titre'  },
  { key:'type',   label:'Type'   },
  { key:'date',   label:'Date'   },
  { key:'cours',  label:'Cours'  },
  { key:'classe', label:'Classe' },
  { key:'bareme', label:'Barème' },
  { key:'session',label:'Session'}
]

const filters = ref({ q:'', cours:'', classe:'', date:'', session:'' })

const coursOptions   = computed(() => school.uniqueExamCours)
const classeOptions  = computed(() => school.uniqueExamClasses)
const sessionOptions = computed(() => school.uniqueExamSessions)

// util pour recherche insensible aux accents/majuscules
function normalize (s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

// Lignes filtrées (réactif)
const rows = computed(() => {
  const q   = normalize(filters.value.q)
  const fC  = normalize(filters.value.cours)
  const fCl = normalize(filters.value.classe)
  const fD  = filters.value.date
  const fS  = filters.value.session

  return school.examens.filter(r => {
    const hay = normalize(`${r.titre} ${r.type} ${r.cours} ${r.classe} ${r.session} ${r.bareme}`)
    const okQ   = q ? hay.includes(q) : true
    const okC   = fC ? normalize(r.cours).includes(fC) : true
    const okCl  = fCl ? normalize(r.classe).includes(fCl) : true
    const okD   = fD ? r.date === fD : true
    const okS   = fS ? r.session === fS : true
    return okQ && okC && okCl && okD && okS
  })
})

// Modal + Form
const modalOpen = ref(false)
const form = ref({ id:null, titre:'', type:'Final', date:'', cours:'', classe:'', bareme:20, session:'Normale' })

function openCreate(){
  if(!canEditPedago.value) return
  form.value = { id:null, titre:'', type:'Final', date:'', cours:'', classe:'', bareme:20, session:'Normale' }
  modalOpen.value = true
}
function openEdit(r){
  if(!canEditPedago.value) return
  form.value = { ...r }
  modalOpen.value = true
}
function save(){
  if(!canEditPedago.value) return
  form.value.id ? update() : create()
  modalOpen.value = false
}
function create(){ school.addExamen({ ...form.value }) }
function update(){ school.updateExamen({ ...form.value }) }
function removeRow(r){
  if(!canEditPedago.value) return
  school.removeExamen(r.id)
}

// compat bouton "Filtrer" (rows est computed, donc rien à faire)
function applyFilters(){ /* no-op */ }
</script>
