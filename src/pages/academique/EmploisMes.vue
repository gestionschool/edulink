<!-- src/pages/academique/EmploisMes.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold">Mes horaires</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Planning hebdomadaire de vos séances.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <span
          class="rounded-md px-2.5 py-1 text-xs border"
          :class="isLinked
            ? 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900'
            : 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200'"
        >
          Prof : {{ profName }} <span v-if="!isLinked" class="opacity-75">(non lié)</span>
        </span>
        <button
          class="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50
                 dark:border-slate-800 dark:bg-slate-900"
          @click="window.print()"
        >
          Imprimer
        </button>
      </div>
    </div>

    <!-- Alerte si pas lié à un teacher -->
    <div
      v-if="!myTeacherId"
      class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800
             dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
    >
      Votre compte n’est pas lié à un professeur (<code>user.teacherId</code> manquant).
      Demandez à l’admin de lier votre compte.
    </div>

    <!-- Filtres légers (quand lié) -->
    <div class="grid gap-3 md:grid-cols-2" v-if="myTeacherId">
      <select v-model.number="classeId"
              class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                     dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        <option value="">— Toutes classes —</option>
        <option v-for="c in classes" :key="c.id" :value="c.id">
          {{ c.libelle || c.label || c.code }}
        </option>
      </select>

      <select v-model.number="periodeId"
              class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                     dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        <option value="">— Période (optionnel) —</option>
        <option v-for="p in periodes" :key="p.id" :value="p.id">
          {{ p.label }}
        </option>
      </select>
    </div>

    <!-- Grille semaine -->
    <WeekGrid
      :sessions="sessionsView"
      @create="canEdit ? openCreate() : null"
      @edit="canEdit ? openEdit : null"
    />

    <!-- Modale CRUD (admins uniquement) -->
    <Modal v-if="canEdit" v-model="open">
      <template #title>
        <h3 class="text-base font-semibold">{{ editId ? 'Modifier la séance' : 'Ajouter une séance' }}</h3>
      </template>

      <form class="space-y-3" @submit.prevent="save">
        <div class="grid gap-3 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Jour</label>
            <select v-model.number="form.jour"
                    class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                           dark:border-slate-800 dark:bg-slate-900">
              <option v-for="(d,i) in days" :key="i" :value="i+1">{{ d }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Salle</label>
            <input v-model="form.salle" type="text"
                   class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                          dark:border-slate-800 dark:bg-slate-900" />
          </div>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Début</label>
            <input v-model="form.start" type="time" required
                   class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                          dark:border-slate-800 dark:bg-slate-900" />
          </div>
          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Fin</label>
            <input v-model="form.end" type="time" required
                   class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                          dark:border-slate-800 dark:bg-slate-900" />
          </div>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Classe</label>
            <select v-model.number="form.classeId" required
                    class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                           dark:border-slate-800 dark:bg-slate-900">
              <option v-for="c in classes" :key="c.id" :value="c.id">
                {{ c.libelle || c.label || c.code }}
              </option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Cours</label>
            <select v-model.number="form.coursId" required
                    class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                           dark:border-slate-800 dark:bg-slate-900">
              <option v-for="co in coursByClasse" :key="co.id" :value="co.id">
                {{ co.matiere }} — {{ co.intitule || co.code }}
              </option>
            </select>
          </div>
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
import { computed, ref, onMounted } from 'vue'
import WeekGrid from '@/components/timetable/WeekGrid.vue'
import Modal from '@/components/ui/Modal.vue'

import { useAuthStore } from '@/stores/useAuth'
import { useSeancesStore } from '@/stores/useSeances'
import { useClassesStore } from '@/stores/useClasses'
import { useCoursStore } from '@/stores/useCours'
import { useTeachersStore } from '@/stores/useTeachers'
import { usePeriodesStore } from '@/stores/usePeriodes'
import { ROLES } from '@/types/roles'

const auth      = useAuthStore()
const seances   = useSeancesStore()
const classesS  = useClassesStore()
const coursS    = useCoursStore()
const teachersS = useTeachersStore()
const periodesS = usePeriodesStore()

const days = ['Lun','Mar','Mer','Jeu','Ven','Sam']

// ⚠️ ne pas forcer 1 par défaut, sinon l’alerte "non lié" ne s’affiche pas
const myTeacherId = computed(() => auth.user?.teacherId ?? 1 )

const myTeacher = computed(() => {
  const tid = myTeacherId.value
  return tid ? (teachersS.items || []).find(t => t.id === tid) : null
})
const profName = computed(() =>
  myTeacher.value
    ? (myTeacher.value.prenom ? `${myTeacher.value.prenom} ${myTeacher.value.nom}` : myTeacher.value.nom)
    : (auth.user?.name ?? '—')
)
const isLinked = computed(() => !!myTeacherId.value)

const canEdit = computed(() =>
  auth.role === ROLES.ADMIN_GENERALE || auth.role === ROLES.ADMIN_ECOLE
)

// filtres
const classeId  = ref('')
const periodeId = ref('')

// modale
const open   = ref(false)
const saving = ref(false)
const error  = ref(null)
const editId = ref(null)
const form = ref({ jour:1, start:'08:00', end:'09:00', classeId:'', coursId:'', teacherId:'', salle:'' })

onMounted(async () => {
  await Promise.all([
    teachersS.fetch(),
    classesS.fetch(),
    coursS.fetch(),
    periodesS.fetch?.()
  ])
  try {
    await seances.fetch()
  } catch (e) {
    console.warn('[seances] manquant (dev) :', e?.message)
  }
})

const classes  = computed(() => classesS.items || [])
const periodes = computed(() => periodesS.items || [])
const coursByClasse = computed(() =>
  (coursS.items||[]).filter(c => !form.value.classeId || Number(c.classeId) === Number(form.value.classeId))
)

const sessionsView = computed(() => {
  let arr = seances.items || []
  const tid = Number(myTeacherId.value || 0)
  if (tid) arr = arr.filter(s => Number(s.teacherId) === tid)
  if (classeId.value)  arr = arr.filter(s => Number(s.classeId) === Number(classeId.value))
  if (periodeId.value) {
    const coursIds = new Set((coursS.items||[])
      .filter(c => Number(c.periodeId) === Number(periodeId.value))
      .map(c => c.id))
    arr = arr.filter(s => coursIds.has(s.coursId))
  }
  const coursById = Object.fromEntries((coursS.items||[]).map(c => [c.id, c]))
  return arr.map(s => ({ ...s, ...(coursById[s.coursId]||{}) }))
})

function openCreate(){
  if (!canEdit.value) return
  error.value=null; editId.value=null
  form.value = {
    jour:1, start:'08:00', end:'09:00',
    classeId: classeId.value || (classes.value[0]?.id ?? ''),
    coursId: '',
    teacherId: myTeacherId.value || '',
    salle:''
  }
  open.value=true
}
function openEdit(ev){
  if (!canEdit.value) return
  error.value=null; editId.value=ev.id
  form.value = { jour:ev.jour, start:ev.start, end:ev.end, classeId:ev.classeId, coursId:ev.coursId, teacherId:ev.teacherId, salle:ev.salle||'' }
  open.value=true
}

async function save(){
  error.value=null; saving.value=true
  try{
    if (editId.value) await seances.updateOne(editId.value, form.value)
    else await seances.createOne(form.value)
    await seances.fetch()
    open.value=false
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
