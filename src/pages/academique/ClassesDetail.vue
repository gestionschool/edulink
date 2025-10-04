<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <RouterLink to="/classes" class="hover:underline">Classes</RouterLink>
          <span>/</span>
          <span class="truncate">{{ classeLabel || 'Détail' }}</span>
        </div>
        <h1 class="mt-1 truncate text-xl font-semibold">{{ classeLabel }}</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Niveau : <b>{{ row?.niveau || '—' }}</b> · Filière : <b>{{ row?.filiere || '—' }}</b> · Titulaire : <b>{{ row?.titulaire || '—' }}</b>
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
          @click="window.print()"
        >
          Imprimer
        </button>
        <button
          type="button"
          class="rounded-md border border-violet-200 bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 dark:border-violet-900"
          @click="openAddStudent = true"
        >
          + Élève
        </button>
        <button
          type="button"
          class="rounded-md border border-violet-200 bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 dark:border-violet-900"
          @click="openAddCours = true"
        >
          + Cours
        </button>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="grid gap-3 sm:grid-cols-3">
      <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <div class="text-xs text-slate-500 dark:text-slate-400">Effectif</div>
        <div class="mt-1 text-2xl font-semibold">{{ eleves.length }}</div>
      </div>
      <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <div class="text-xs text-slate-500 dark:text-slate-400">Cours</div>
        <div class="mt-1 text-2xl font-semibold">{{ cours.length }}</div>
      </div>
      <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <div class="text-xs text-slate-500 dark:text-slate-400">Période active</div>
        <div class="mt-1 text-2xl font-semibold">{{ periodeActiveLabel || '—' }}</div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap items-center gap-2">
      <button :class="tabBtn('eleves')"   @click="tab='eleves'">Élèves</button>
      <button :class="tabBtn('cours')"    @click="tab='cours'">Cours</button>
    </div>

    <!-- Élèves -->
    <div v-if="tab==='eleves'" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm dark:border-slate-800">
        <input v-model="qEleves" type="search" placeholder="Rechercher un élève (nom, matricule)…"
               class="w-64 max-w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"/>
        <span class="text-slate-500 dark:text-slate-400">{{ elevesRows.length }} / {{ eleves.length }}</span>
      </div>

      <div v-if="eleves.length===0" class="p-6 text-sm text-slate-500 dark:text-slate-400">Aucun élève dans cette classe.</div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th class="px-4 py-3 font-medium">Nom</th>
              <th class="px-4 py-3 font-medium">Matricule</th>
              <th class="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in elevesRows" :key="e.id" class="border-t border-slate-100 dark:border-slate-800">
              <td class="px-4 py-3">{{ e.nom }}</td>
              <td class="px-4 py-3 text-slate-500 dark:text-slate-400">{{ e.matricule || '—' }}</td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-2">
                  <RouterLink
                    :to="`/communautes/etudiants/detail?id=${e.id}`"
                    class="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                  >Détails</RouterLink>
                  <button
                    class="rounded-lg border border-amber-200 px-2 py-1 text-xs text-amber-700 hover:bg-amber-50 dark:border-amber-900/40 dark:text-amber-300 dark:hover:bg-amber-900/10"
                    @click="retirerEleve(e.id)"
                  >Retirer</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Cours -->
    <div v-else class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm dark:border-slate-800">
        <input v-model="qCours" type="search" placeholder="Rechercher un cours (matière, intitule)…"
               class="w-64 max-w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"/>
        <span class="text-slate-500 dark:text-slate-400">{{ coursRows.length }} / {{ cours.length }}</span>
      </div>

      <div v-if="cours.length===0" class="p-6 text-sm text-slate-500 dark:text-slate-400">Aucun cours pour cette classe.</div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th class="px-4 py-3 font-medium">Matière</th>
              <th class="px-4 py-3 font-medium">Intitulé</th>
              <th class="px-4 py-3 font-medium">Professeur</th>
              <th class="px-4 py-3 font-medium">Période</th>
              <th class="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in coursRows" :key="c.id" class="border-t border-slate-100 dark:border-slate-800">
              <td class="px-4 py-3">{{ c.matiere || '—' }}</td>
              <td class="px-4 py-3">{{ c.intitule || c.code }}</td>
              <td class="px-4 py-3">{{ teacherName(c.teacherId) }}</td>
              <td class="px-4 py-3">{{ periodeLabel(c.periodeId) }}</td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-2">
                  <RouterLink
                    :to="`/cours/detail?id=${c.id}`"
                    class="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                  >Détails</RouterLink>
                  <button
                    class="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
                    @click="supprimerCours(c.id)"
                  >Supprimer</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modale: ajouter élève -->
    <div v-if="openAddStudent" class="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div class="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <h3 class="mb-3 text-base font-semibold">Ajouter un élève</h3>
        <form class="space-y-3" @submit.prevent="createEleve">
          <div class="grid gap-3 sm:grid-cols-2">
            <input v-model="formEleve.nom" placeholder="Nom complet" class="input"/>
            <input v-model="formEleve.matricule" placeholder="Matricule" class="input"/>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" class="btn" @click="openAddStudent=false">Annuler</button>
            <button type="submit" class="btn-primary">Créer</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modale: ajouter cours -->
    <div v-if="openAddCours" class="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div class="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <h3 class="mb-3 text-base font-semibold">Ajouter un cours</h3>
        <form class="space-y-3" @submit.prevent="createCours">
          <div class="grid gap-3 sm:grid-cols-3">
            <input v-model="formCours.code" placeholder="Code (ex: MAT101)" class="input"/>
            <input v-model="formCours.matiere" placeholder="Matière (ex: Math)" class="input"/>
            <input v-model="formCours.intitule" placeholder="Intitulé" class="input"/>
          </div>
          <div class="grid gap-3 sm:grid-cols-3">
            <select v-model.number="formCours.teacherId" class="input">
              <option value="">— Professeur —</option>
              <option v-for="t in teachers" :key="t.id" :value="t.id">
                {{ t.prenom ? (t.prenom+' '+t.nom) : t.nom }}
              </option>
            </select>
            <select v-model.number="formCours.periodeId" class="input">
              <option value="">— Période —</option>
              <option v-for="p in periodes" :key="p.id" :value="p.id">{{ p.label }}</option>
            </select>
            <input v-model.number="formCours.volume" type="number" min="0" placeholder="Volume (h)" class="input"/>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" class="btn" @click="openAddCours=false">Annuler</button>
            <button type="submit" class="btn-primary">Créer</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Empty / erreur classe -->
    <div v-if="!loading && !row" class="rounded-xl border border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      Classe introuvable.
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { useClasses }  from '@/stores/useClasses'
import { useStudents } from '@/stores/useStudents'
import { useCours }    from '@/stores/useCours'
import { useTeachers } from '@/stores/useTeachers'
import { usePeriodes } from '@/stores/usePeriodes'

const route = useRoute()
const classesS  = useClasses()
const studentsS = useStudents()
const coursS    = useCours()
const teachersS = useTeachers()
const periodesS = usePeriodes()

const id = ref(Number(route.query.id || 0))

watch(() => route.query.id, v => { id.value = Number(v || 0) })

const loading = ref(true)
onMounted(async () => {
  await Promise.all([
    classesS.fetch(),
    studentsS.fetch(),
    coursS.fetch(),
    teachersS.fetch(),
    periodesS.fetch?.()
  ])
  loading.value = false
})

/* ===== Données ===== */
const row = computed(() => classesS.byId[id.value] || (classesS.items||[]).find(c => c.id === id.value) || null)
const classeLabel = computed(() => row.value ? (row.value.libelle || row.value.label || row.value.code) : '')

const eleves = computed(() => (studentsS.items||[]).filter(e => Number(e.classeId) === id.value))
const cours  = computed(() => (coursS.items||[]).filter(c => Number(c.classeId) === id.value))

const teachers = computed(() => teachersS.items || [])
const periodes = computed(() => periodesS.items || [])
const teachersById = computed(() => Object.fromEntries((teachers.value||[]).map(t => [t.id, t])))
const periodesById = computed(() => Object.fromEntries((periodes.value||[]).map(p => [p.id, p])))

function teacherName(tid){
  const t = teachersById.value[tid]
  if (!t) return '—'
  return t.prenom ? `${t.prenom} ${t.nom}` : t.nom
}
function periodeLabel(pid){ return periodesById.value[pid]?.label || '—' }
const periodeActiveLabel = computed(() => (periodes.value||[]).find(p => p.active)?.label || '')

/* ===== Tabs & filtres ===== */
const tab = ref('eleves')
const qEleves = ref('')
const qCours  = ref('')

const elevesRows = computed(() => {
  const t = qEleves.value.trim().toLowerCase()
  if (!t) return eleves.value
  return eleves.value.filter(e => `${e.nom} ${e.matricule||''}`.toLowerCase().includes(t))
})
const coursRows = computed(() => {
  const t = qCours.value.trim().toLowerCase()
  if (!t) return cours.value
  return cours.value.filter(c => `${c.matiere||''} ${c.intitule||c.code||''}`.toLowerCase().includes(t))
})

/* ===== Actions élèves ===== */
async function retirerEleve(eleveId){
  if (!confirm('Retirer cet élève de la classe ?')) return
  // on passe classeId à null
  await studentsS.updateOne(eleveId, { classeId: null })
  await studentsS.fetch()
}

/* ===== Actions cours ===== */
async function supprimerCours(coursId){
  if (!confirm('Supprimer ce cours ?')) return
  await coursS.removeOne(coursId)
  await coursS.fetch()
}

/* ===== Modales ===== */
const openAddStudent = ref(false)
const formEleve = ref({ nom: '', matricule: '' })

async function createEleve(){
  if (!formEleve.value.nom.trim()) return alert('Nom requis')
  const payload = {
    nom: formEleve.value.nom.trim(),
    matricule: formEleve.value.matricule.trim(),
    classeId: id.value,
    // ecoleId optionnel si tu l’as sur la classe
    ...(row.value?.ecoleId ? { ecoleId: row.value.ecoleId } : {})
  }
  await studentsS.createOne(payload)
  await studentsS.fetch()
  formEleve.value = { nom: '', matricule: '' }
  openAddStudent.value = false
}

const openAddCours = ref(false)
const formCours = ref({ code:'', matiere:'', intitule:'', teacherId:'', periodeId:'', volume: 0 })

async function createCours(){
  if (!formCours.value.matiere || !formCours.value.teacherId || !formCours.value.periodeId)
    return alert('Matière, professeur et période sont requis.')
  const payload = {
    ...formCours.value,
    classeId: id.value,
    volume: Number(formCours.value.volume || 0),
    ...(row.value?.ecoleId ? { ecoleId: row.value.ecoleId } : {})
  }
  await coursS.createOne(payload)
  await coursS.fetch()
  formCours.value = { code:'', matiere:'', intitule:'', teacherId:'', periodeId:'', volume: 0 }
  openAddCours.value = false
}

/* ===== UI helpers ===== */
function tabBtn(name){
  const active = tab.value === name
  return [
    'rounded-md px-3 py-1.5 text-sm border',
    active
      ? 'border-violet-300 bg-violet-600 text-white dark:border-violet-800'
      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
  ].join(' ')
}
</script>


