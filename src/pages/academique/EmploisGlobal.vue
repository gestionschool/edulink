<!-- src/pages/academique/EmploisGlobal.vue -->
<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold">Emplois du temps</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Vue hebdomadaire. Filtre par classe ou professeur.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button class="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
                @click="window.print()">Imprimer</button>
      </div>
    </div>

    <!-- Filtres -->
    <div class="grid gap-3 md:grid-cols-3">
      <select v-model.number="classeId"
              class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        <option value="">— Classe —</option>
        <option v-for="c in classes" :key="c.id" :value="c.id">
          {{ c.libelle || c.label || c.code }}
        </option>
      </select>

      <select v-model.number="teacherId"
              class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        <option value="">— Professeur —</option>
        <option v-for="t in teachers" :key="t.id" :value="t.id">
          {{ t.prenom ? (t.prenom + ' ' + t.nom) : t.nom }}
        </option>
      </select>

      <select v-model.number="periodeId"
              class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        <option value="">— Période —</option>
        <option v-for="p in periodes" :key="p.id" :value="p.id">
          {{ p.label }}
        </option>
      </select>
    </div>

    <!-- Grille -->
    <WeekGrid
      :sessions="sessionsView"
      @create="openCreate()"
      @edit="openEdit"
    />

    <!-- MODALE: créer / éditer -->
    <Modal v-model="open">
      <template #title>
        <h3 class="text-base font-semibold">{{ editId ? 'Modifier la séance' : 'Ajouter une séance' }}</h3>
      </template>

      <form class="space-y-3" @submit.prevent="save">
        <div class="grid gap-3 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Jour</label>
            <select v-model.number="form.jour"
                    class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900">
              <option v-for="(d,i) in days" :key="i" :value="i+1">{{ d }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Salle</label>
            <input v-model="form.salle" type="text"
                   class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900" />
          </div>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Début</label>
            <input v-model="form.start" type="time" required
                   class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900" />
          </div>
          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Fin</label>
            <input v-model="form.end" type="time" required
                   class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900" />
          </div>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Classe</label>
            <select v-model.number="form.classeId" required
                    class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900">
              <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.libelle || c.label || c.code }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Cours</label>
            <select v-model.number="form.coursId" required
                    class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900">
              <option v-for="co in coursByClasse" :key="co.id" :value="co.id">
                {{ co.matiere }} — {{ co.intitule || co.code }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Professeur</label>
          <select v-model.number="form.teacherId" required
                  class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900">
            <option v-for="t in teachers" :key="t.id" :value="t.id">
              {{ t.prenom ? (t.prenom + ' ' + t.nom) : t.nom }}
            </option>
          </select>
        </div>

        <p v-if="error" class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
      </form>

      <template #actions>
        <button class="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
                @click="open=false" :disabled="saving">Annuler</button>
        <button class="inline-flex items-center rounded-md border border-violet-200 bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60 dark:border-violet-900"
                @click="save" :disabled="saving">{{ editId ? 'Mettre à jour' : 'Créer' }}</button>
        <button v-if="editId"
                class="ml-auto inline-flex items-center rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
                @click="remove" :disabled="saving">Supprimer</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import WeekGrid from '@/components/timetable/WeekGrid.vue'

import { useSeancesStore } from '@/stores/useSeances'
import { useClassesStore } from '@/stores/useClasses'
import { useTeachersStore } from '@/stores/useTeachers'
import { useCoursStore } from '@/stores/useCours'
import { usePeriodesStore } from '@/stores/usePeriodes' // si tu l’as déjà, sinon supprime ce filtre

const seances  = useSeancesStore()
const classesS = useClassesStore()
const teachersS= useTeachersStore()
const coursS   = useCoursStore()
const periodesS= usePeriodesStore?.()

const classeId  = ref('')
const teacherId = ref('')
const periodeId = ref('')

const open   = ref(false)
const saving = ref(false)
const error  = ref(null)
const editId = ref(null)
const days = ['Lun','Mar','Mer','Jeu','Ven','Sam']

const form = ref({
  jour: 1, start: '08:00', end: '09:00',
  classeId: '', coursId: '', teacherId: '', salle: ''
})

onMounted(async () => {
  await Promise.all([
    classesS.fetch(),
    teachersS.fetch(),
    coursS.fetch(),
    periodesS?.fetch?.()
  ])
  try {
    await seances.fetch()
  } catch (e) {
    console.warn('[seances] manquant (dev) :', e?.message)
    // On continue sans caler toute la page
  }
})

watch(classeId, () => { if (classeId.value) teacherId.value = '' })
watch(teacherId, () => { if (teacherId.value) classeId.value = '' })

const classes  = computed(() => classesS.items || [])
const teachers = computed(() => teachersS.items || [])
const periodes = computed(() => periodesS?.items || [])
const coursByClasse = computed(() =>
  (coursS.items||[]).filter(c => !form.value.classeId || Number(c.classeId) === Number(form.value.classeId))
)

const sessionsView = computed(() => {
  let arr = seances.items || []
  if (classeId.value)  arr = arr.filter(s => Number(s.classeId)  === Number(classeId.value))
  if (teacherId.value) arr = arr.filter(s => Number(s.teacherId) === Number(teacherId.value))
  // enrichi pour l’affichage
  const coursById = Object.fromEntries((coursS.items||[]).map(c => [c.id, c]))
  return arr.map(s => ({
    ...s,
    ...(coursById[s.coursId]||{}),
  }))
})

function openCreate(){
  error.value=null; editId.value=null
  form.value = {
    jour: 1, start:'08:00', end:'09:00',
    classeId: classeId.value || (classes.value[0]?.id ?? ''),
    coursId: '', teacherId: teacherId.value || (teachers.value[0]?.id ?? ''),
    salle:''
  }
  open.value = true
}
function openEdit(ev){
  error.value=null; editId.value=ev.id
  form.value = { jour: ev.jour, start: ev.start, end: ev.end, classeId: ev.classeId, coursId: ev.coursId, teacherId: ev.teacherId, salle: ev.salle||'' }
  open.value = true
}

async function save(){
  error.value=null
  const { jour, start, end, classeId:cid, coursId, teacherId:tid } = form.value
  if (!jour || !start || !end || !cid || !coursId || !tid) { error.value='Champs requis manquants.'; return }
  saving.value=true
  try{
    if (editId.value) await seances.updateOne(editId.value, form.value)
    else await seances.createOne(form.value)
    await seances.fetch()
    open.value = false
  }catch(e){ error.value = e?.message || 'Erreur'; }
  finally{ saving.value=false }
}
async function remove(){
  if (!editId.value) return
  if (!confirm('Supprimer cette séance ?')) return
  saving.value=true
  try{
    await seances.removeOne(editId.value)
    await seances.fetch()
    open.value=false
  } finally { saving.value=false }
}
</script>
