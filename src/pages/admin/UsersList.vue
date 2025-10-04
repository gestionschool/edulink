<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold">Utilisateurs</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Comptes de la plateforme (Admin général, Admin école, Professeur).
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          class="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 dark:border-violet-900"
          @click="openCreate"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>
          Nouvel utilisateur
        </button>
      </div>
    </div>

    <!-- Filtres -->
    <div class="grid gap-3 md:grid-cols-3">
      <input
        v-model="q"
        type="search"
        placeholder="Rechercher (nom)…"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
               focus:border-violet-500 focus:ring-1 focus:ring-violet-500
               dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      />

      <select
        v-model="role"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
               focus:border-violet-500 focus:ring-1 focus:ring-violet-500
               dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      >
        <option value="">Tous rôles</option>
        <option v-for="r in roleOptions" :key="r.value" :value="r.value">{{ r.label }}</option>
      </select>

      <select
        v-model.number="ecoleId"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
               focus:border-violet-500 focus:ring-1 focus:ring-violet-500
               dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      >
        <option value="">Toutes écoles</option>
        <option v-for="e in ecoles" :key="e.id" :value="e.id">{{ e.nom }}</option>
      </select>
    </div>

    <!-- Bloc d’état -->
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div v-if="store.loading" class="p-6 space-y-2">
        <div class="h-4 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
        <div class="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
      </div>
      <div v-else-if="store.error" class="p-6 text-sm text-red-600 dark:text-red-400">
        {{ store.error?.message || store.error }}
      </div>
      <div v-else>
        <!-- Mobile cards -->
        <div class="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          <div v-for="u in rows" :key="u.id" class="p-3">
            <div class="flex items-center justify-between">
              <div class="min-w-0">
                <div class="truncate font-medium">{{ u.name }}</div>
                <div class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {{ roleLabel(u.role) }}
                  <span v-if="u.ecoleId">· {{ ecoleName(u.ecoleId) }}</span>
                  <span v-if="u.teacherId">· Prof: {{ teacherName(u.teacherId) }}</span>
                </div>
              </div>
              <div class="shrink-0 flex gap-2">
                <button class="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" @click="openEdit(u)">Modifier</button>
                <button class="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20" @click="remove(u.id)">Supprimer</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Table desktop -->
        <div class="hidden md:block overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th class="px-4 py-3 font-medium">Nom</th>
                <th class="px-4 py-3 font-medium">Rôle</th>
                <th class="px-4 py-3 font-medium">École</th>
                <th class="px-4 py-3 font-medium">Professeur lié</th>
                <th class="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in rows" :key="u.id" class="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60">
                <td class="px-4 py-3">{{ u.name }}</td>
                <td class="px-4 py-3">
                  <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                        :class="badgeClass(u.role)">{{ roleLabel(u.role) }}</span>
                </td>
                <td class="px-4 py-3">{{ ecoleName(u.ecoleId) || '—' }}</td>
                <td class="px-4 py-3">{{ teacherName(u.teacherId) || '—' }}</td>
                <td class="px-4 py-3">
                  <div class="flex justify-end gap-2">
                    <button class="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                            @click="openEdit(u)">Modifier</button>
                    <button class="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
                            @click="remove(u.id)">Supprimer</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm dark:border-slate-800">
            <span class="text-slate-500 dark:text-slate-400">
              {{ rows.length }} / {{ total }} éléments
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modale CRUD -->
    <Modal v-model="open">
      <template #title>
        <h3 class="text-base font-semibold">{{ editId ? 'Modifier l’utilisateur' : 'Nouvel utilisateur' }}</h3>
      </template>

      <form class="space-y-3" @submit.prevent="save">
        <div class="grid gap-3 md:grid-cols-2">
          <div class="md:col-span-2">
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Nom</label>
            <input v-model="form.name" type="text" required
                   class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900" />
          </div>

          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Rôle</label>
            <select v-model="form.role" required
                    class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900">
              <option v-for="r in roleOptions" :key="r.value" :value="r.value">{{ r.label }}</option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">École</label>
            <select v-model.number="form.ecoleId"
                    class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900">
              <option value="">— Aucune —</option>
              <option v-for="e in ecoles" :key="e.id" :value="e.id">{{ e.nom }}</option>
            </select>
          </div>

          <!-- Visible si PROFESSEUR -->
          <div class="md:col-span-2" v-if="form.role === ROLES.PROFESSEUR">
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Lier à un professeur (optionnel)</label>
            <select v-model.number="form.teacherId"
                    class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900">
              <option value="">— Aucun —</option>
              <option v-for="t in teachers" :key="t.id" :value="t.id">
                {{ t.prenom ? (t.prenom + ' ' + t.nom) : t.nom }}
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
                @click="save" :disabled="saving">
          {{ editId ? 'Mettre à jour' : 'Créer' }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import { useUsers } from '@/stores/useUsers'
import { useTeachers } from '@/stores/useTeachers'
import { useEcoles } from '@/stores/useEcoles'
import { ROLES } from '@/types/roles'

const store     = useUsers()
const teachersS = useTeachers()
const ecolesS   = useEcoles()

// Filtres
const q       = ref('')
const role    = ref('')
const ecoleId = ref('')

// Modale
const open   = ref(false)
const saving = ref(false)
const error  = ref(null)
const editId = ref(null)
const form   = ref({ name:'', role:'', ecoleId:'', teacherId:'' })

onMounted(async () => {
  await Promise.all([
    store.fetch(),
    teachersS.fetch(),
    ecolesS.fetch?.(),
  ])
})

// Options
const roleOptions = [
  { value: ROLES.ADMIN_GENERALE, label: 'Admin général' },
  { value: ROLES.ADMIN_ECOLE,    label: 'Admin école' },
  { value: ROLES.PROFESSEUR,     label: 'Professeur' },
]

// Data de jointure
const teachers = computed(() => teachersS.items || [])
const ecoles   = computed(() => ecolesS.items || [])
const teacherById = computed(() => Object.fromEntries(teachers.value.map(t => [t.id, t])))
const ecoleById   = computed(() => Object.fromEntries(ecoles.value.map(e => [e.id, e])))

function teacherName(id){
  const t = teacherById.value[id]
  return t ? (t.prenom ? `${t.prenom} ${t.nom}` : t.nom) : ''
}
function ecoleName(id){
  const e = ecoleById.value[id]
  return e?.nom || ''
}

// Liste filtrée
const rows = computed(() => {
  const term = q.value.trim().toLowerCase()
  return (store.items || []).filter(u => {
    if (role.value && u.role !== role.value) return false
    if (ecoleId.value && Number(u.ecoleId) !== Number(ecoleId.value)) return false
    if (!term) return true
    return (u.name || '').toLowerCase().includes(term)
  })
})
const total = computed(() => store.items?.length || 0)

// Badges & libellés
function roleLabel(r){
  const item = roleOptions.find(x => x.value === r)
  return item ? item.label : r || '—'
}
function badgeClass(r){
  const base = 'px-2 py-0.5 border'
  switch (r) {
    case ROLES.ADMIN_GENERALE:
      return `${base} border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-900/30 dark:text-indigo-200`
    case ROLES.ADMIN_ECOLE:
      return `${base} border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/30 dark:text-emerald-200`
    case ROLES.PROFESSEUR:
      return `${base} border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/30 dark:text-amber-200`
    default:
      return `${base} border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200`
  }
}

// CRUD
function openCreate(){
  editId.value = null
  error.value = null
  form.value = { name:'', role: ROLES.ADMIN_ECOLE, ecoleId:'', teacherId:'' }
  open.value = true
}
function openEdit(u){
  editId.value = u.id
  error.value = null
  form.value = { name: u.name || '', role: u.role || '', ecoleId: u.ecoleId || '', teacherId: u.teacherId || '' }
  open.value = true
}
async function save(){
  error.value = null
  saving.value = true
  try{
    const payload = { ...form.value }
    // nettoyage basique
    if (payload.role !== ROLES.PROFESSEUR) payload.teacherId = undefined
    if (!payload.ecoleId) payload.ecoleId = undefined

    if (editId.value) await store.updateOne(editId.value, payload)
    else await store.createOne(payload)

    await store.fetch()
    open.value = false
  }catch(e){
    error.value = e?.message || 'Erreur'
  }finally{
    saving.value = false
  }
}
async function remove(id){
  if (!confirm('Supprimer cet utilisateur ?')) return
  await store.removeOne(id)
  await store.fetch()
}
</script>
