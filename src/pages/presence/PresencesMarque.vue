<!-- src/pages/presence/PresencesMarque.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold">Marquer les présences</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Sélectionne une date, une classe, un cours — puis marque Présent / Absent / Retard.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <button type="button" class="btn" @click="markAll('P')" :disabled="!canMark">Tout P</button>
        <button type="button" class="btn" @click="markAll('A')" :disabled="!canMark">Tout A</button>
        <button type="button" class="btn" @click="markAll('R')" :disabled="!canMark">Tout R</button>

        <button
          type="button"
          class="btn-primary"
          @click="saveAll"
          :disabled="!canMark || saving"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5 13l4 4L19 7"/></svg>
          <span v-if="!saving">Enregistrer</span>
          <span v-else>Enregistrement…</span>
        </button>
      </div>
    </div>

    <!-- Filtres -->
    <div class="grid gap-3 sm:grid-cols-3">
      <input v-model="date" type="date" class="input" />

      <select v-model="classeId" class="input">
        <option value="">— Classe —</option>
        <option v-for="c in classes" :key="c.id" :value="String(c.id)">
          {{ c.libelle || c.label || c.code }}
        </option>
      </select>

      <select v-model="coursId" class="input">
        <option value="">— Cours —</option>
        <option v-for="co in coursFiltres" :key="co.id" :value="String(co.id)">
          {{ co.matiere }} — {{ co.intitule || co.code }}
        </option>
      </select>
    </div>

    <!-- États -->
    <div v-if="!classeId" class="panel-muted">Choisis une classe pour commencer.</div>
    <div v-else-if="!coursId" class="panel-muted">Choisis un cours pour cette classe.</div>

    <!-- Liste élèves -->
    <div v-else class="panel">
      <div class="panel-head">
        <span class="text-slate-600 dark:text-slate-300">
          {{ eleves.length }} élèves — {{ libelleClasse }} — {{ libelleCours }}
        </span>
        <span v-if="pres.loading" class="text-slate-500 dark:text-slate-400">Chargement…</span>
      </div>

      <!-- Mobile -->
      <div class="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        <div v-for="st in eleves" :key="st.id" class="flex items-center justify-between p-3">
          <div class="min-w-0">
            <div class="truncate text-sm font-medium">{{ st.nom }}</div>
            <div class="text-xs text-slate-500 dark:text-slate-400">{{ st.matricule }}</div>
          </div>
          <div class="shrink-0 flex gap-1">
            <button type="button" :class="btnClass(st.id, 'P')" @click="setStatut(st.id, 'P')">P</button>
            <button type="button" :class="btnClass(st.id, 'A')" @click="setStatut(st.id, 'A')">A</button>
            <button type="button" :class="btnClass(st.id, 'R')" @click="setStatut(st.id, 'R')">R</button>
          </div>
        </div>
      </div>

      <!-- Desktop -->
      <div class="hidden md:block overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th class="px-4 py-3 font-medium">Élève</th>
              <th class="px-4 py-3 font-medium">Matricule</th>
              <th class="px-4 py-3 font-medium w-56">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="st in eleves" :key="st.id" class="border-t border-slate-100 dark:border-slate-800">
              <td class="px-4 py-3">{{ st.nom }}</td>
              <td class="px-4 py-3 text-slate-500 dark:text-slate-400">{{ st.matricule }}</td>
              <td class="px-4 py-3">
                <div class="inline-flex rounded-md border border-slate-200 overflow-hidden dark:border-slate-700">
                  <button type="button" :class="segClass(st.id, 'P')" @click="setStatut(st.id, 'P')">Présent</button>
                  <button type="button" :class="segClass(st.id, 'A')" @click="setStatut(st.id, 'A')">Absent</button>
                  <button type="button" :class="segClass(st.id, 'R')" @click="setStatut(st.id, 'R')">Retard</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Barre action sticky -->
      <div class="sticky bottom-0 flex items-center justify-between gap-3 border-t border-slate-100 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <span class="text-xs text-slate-500 dark:text-slate-400">
          Non enregistrée(s) : {{ modCount }}
        </span>
        <button type="button" class="btn-primary" @click="saveAll" :disabled="!canMark || saving">
          Enregistrer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/useAuth'
import { useClassesStore } from '@/stores/useClasses'
import { useCoursStore } from '@/stores/useCours'
import { useStudentsStore } from '@/stores/useStudents'
import { usePresencesStore } from '@/stores/usePresences'

const auth = useAuthStore()
const classesStore = useClassesStore()
const coursStore   = useCoursStore()
const studentsStore= useStudentsStore()
const pres         = usePresencesStore()

// Filtres
const today = new Date().toISOString().slice(0,10)
const date     = ref(today)
const classeId = ref('')   // string, converti via Number() au besoin
const coursId  = ref('')   // string
const saving   = ref(false)

// Map<eleveId, 'P'|'A'|'R'>
const statuts = ref({})

// Chargements init
onMounted(async () => {
  await Promise.all([
    classesStore.fetch(),
    coursStore.fetch(),
    studentsStore.fetch(),
  ])
})

// Rechargement des présences à chaque changement
watch([date, classeId, coursId], async () => {
  const cls = Number(classeId.value)
  const crs = Number(coursId.value)
  if (!date.value || !cls || !crs) return

  try {
    await pres.fetch({ date: date.value, classeId: cls, coursId: crs })
    const map = {}
    ;(pres.items || []).forEach(p => { map[p.eleveId] = p.statut })
    statuts.value = map
  } catch (e) {
    console.error('[presences] fetch error', e)
    statuts.value = {}
  }
})

// Données dérivées
const classes = computed(() => classesStore.items || [])
const coursFiltres = computed(() => {
  const cls = Number(classeId.value)
  return (coursStore.items || []).filter(c => Number(c.classeId) === cls)
})
const eleves = computed(() => {
  const cls = Number(classeId.value)
  return (studentsStore.items || []).filter(e => Number(e.classeId) === cls)
})

const libelleClasse = computed(() => {
  const id = Number(classeId.value)
  const c = classesStore.byId?.[id]
  return c ? (c.libelle || c.label || c.code) : ''
})
const libelleCours = computed(() => {
  const id = Number(coursId.value)
  const co = coursStore.byId?.[id]
  return co ? `${co.matiere} — ${co.intitule || co.code}` : ''
})

const canMark  = computed(() => !!date.value && !!Number(classeId.value) && !!Number(coursId.value))
const modCount = computed(() => Object.keys(statuts.value).length)

// UI helpers
function btnClass(id, v) {
  const active = statuts.value[id] === v
  return [
    'h-8 w-8 inline-flex items-center justify-center rounded-md border text-xs',
    active
      ? 'border-violet-300 bg-violet-600 text-white dark:border-violet-800'
      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200',
  ].join(' ')
}
function segClass(id, v) {
  const active = statuts.value[id] === v
  return [
    'px-3 py-1 text-xs',
    active ? 'bg-violet-600 text-white'
           : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200',
  ].join(' ')
}

// Actions
function setStatut(eleveId, v){ statuts.value = { ...statuts.value, [eleveId]: v } }
function markAll(v){
  const next = {}
  eleves.value.forEach(e => { next[e.id] = v })
  statuts.value = next
}

async function saveAll(){
  if (!canMark.value) return
  saving.value = true
  try {
    const cls = Number(classeId.value)
    const crs = Number(coursId.value)
    const existingByStudent = Object.fromEntries((pres.items || []).map(p => [p.eleveId, p]))
    const teacherId = auth.user?.teacherId ?? auth.user?.id ?? null

    const ops = eleves.value.map(async (e) => {
      const statut = statuts.value[e.id]
      if (!statut) return

      const found = existingByStudent[e.id]
      if (found) {
        if (found.statut !== statut) await pres.updateOne(found.id, { statut })
      } else {
        await pres.createOne({
          date: date.value, classeId: cls, coursId: crs,
          eleveId: e.id, statut, teacherId,
        })
      }
    })

    await Promise.all(ops)
    await pres.fetch({ date: date.value, classeId: cls, coursId: crs })

    const map = {}
    ;(pres.items || []).forEach(p => { map[p.eleveId] = p.statut })
    statuts.value = map

    alert('Présences enregistrées ✔')
  } catch (e) {
    console.error(e)
    alert('Erreur lors de l’enregistrement')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>

</style>
