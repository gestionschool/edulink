<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold">Professeurs</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Liste des professeurs. Filtre par matière et statut. Export CSV.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
          @click="printPage"
        >
          Imprimer
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 dark:border-violet-900"
          @click="exportCsv"
        >
          Export CSV
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 dark:border-violet-900"
          @click="openModal = true"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>
          Nouveau professeur
        </button>
      </div>
    </div>

    <!-- Filtres -->
    <div class="grid gap-3 md:grid-cols-3">
      <input
        v-model="q"
        type="search"
        placeholder="Rechercher (nom, email)…"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      />
      <select
        v-model="matiere"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      >
        <option value="">Toutes matières</option>
        <option v-for="m in matieresOptions" :key="m" :value="m">{{ m }}</option>
      </select>
      <select
        v-model="statut"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      >
        <option value="">Tous statuts</option>
        <option value="Actif">Actif</option>
        <option value="Inactif">Inactif</option>
      </select>
    </div>

    <!-- États -->
    <div v-if="teachers.loading" class="rounded-xl border border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      Chargement…
    </div>
    <div v-else-if="rows.length === 0" class="rounded-xl border border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      Aucun professeur trouvé.
    </div>

    <!-- Mobile: cartes -->
    <div v-else class="md:hidden divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div v-for="p in rows" :key="p.id" class="p-3">
        <div class="flex items-center justify-between">
          <div class="min-w-0">
            <div class="truncate text-sm font-medium">{{ fullName(p) }}</div>
            <div class="text-xs text-slate-500 dark:text-slate-400">{{ p.email }}</div>
          </div>
          <span :class="badgeClass(p.statut)">{{ p.statut || '—' }}</span>
        </div>
        <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {{ p.matiere || '—' }}
        </div>
        <div class="mt-2 flex justify-end">
          <button class="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20" @click="remove(p.id)">
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop: table -->
    <div v-if="rows.length" class="hidden md:block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th class="px-4 py-3 font-medium">Nom</th>
              <th class="px-4 py-3 font-medium">Email</th>
              <th class="px-4 py-3 font-medium">Matière</th>
              <th class="px-4 py-3 font-medium">Statut</th>
              <th class="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in rows"
              :key="p.id"
              class="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
            >
              <td class="px-4 py-3">{{ fullName(p) }}</td>
              <td class="px-4 py-3">{{ p.email }}</td>
              <td class="px-4 py-3">{{ p.matiere || '—' }}</td>
              <td class="px-4 py-3">
                <span :class="badgeClass(p.statut)">{{ p.statut || '—' }}</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-2">
                  <RouterLink
                    :to="`/professeurs/detail?id=${p.id}`"
                    class="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    Détails
                  </RouterLink>
                  <button
                    class="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
                    @click="remove(p.id)"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="border-t border-slate-100 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          {{ rows.length }} / {{ total }} élément(s)
        </div>
      </div>
    </div>

    <!-- MODALE: Nouveau professeur -->
    <Modal v-model="openModal">
      <template #title><h3 class="text-base font-semibold">Nouveau professeur</h3></template>

      <form class="space-y-3" @submit.prevent="submit">
        <div class="grid gap-3 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Nom</label>
            <input v-model="form.nom" type="text" required
                   class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900" />
          </div>
          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Prénom</label>
            <input v-model="form.prenom" type="text"
                   class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900" />
          </div>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Email</label>
            <input v-model="form.email" type="email" required
                   class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900" />
          </div>
          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Matière</label>
            <input v-model="form.matiere" type="text"
                   class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900" />
          </div>
        </div>

        <div>
          <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Statut</label>
          <select v-model="form.statut"
                  class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900">
            <option value="Actif">Actif</option>
            <option value="Inactif">Inactif</option>
          </select>
        </div>

        <p v-if="error" class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
      </form>

      <template #actions>
        <button
          class="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
          @click="openModal = false"
          :disabled="saving"
        >Annuler</button>
        <button
          class="inline-flex items-center rounded-md border border-violet-200 bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60 dark:border-violet-900"
          @click="submit"
          :disabled="saving"
        >Créer</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import Modal from '@/components/ui/Modal.vue'
import { useTeachers } from '@/stores/useTeachers'

const teachers = useTeachers()

const q = ref('')
const matiere = ref('')
const statut  = ref('')

const openModal = ref(false)
const saving = ref(false)
const error = ref(null)
const form = ref({ nom:'', prenom:'', email:'', matiere:'', statut:'Actif' })

onMounted(async () => { await teachers.fetch() })

const matieresOptions = computed(() =>
  Array.from(new Set((teachers.items || []).map(t => t.matiere).filter(Boolean))).sort()
)

const rows = computed(() => {
  const term = q.value.trim().toLowerCase()
  return (teachers.items || []).filter(t => {
    if (matiere.value && t.matiere !== matiere.value) return false
    if (statut.value && t.statut !== statut.value) return false
    if (!term) return true
    const hay = `${t.nom || ''} ${t.prenom || ''} ${t.email || ''}`.toLowerCase()
    return hay.includes(term)
  })
})

const total = computed(() => teachers.items?.length || 0)
const fullName = (t) => [t.prenom, t.nom].filter(Boolean).join(' ') || t.nom || '—'

function badgeClass(v){
  const base = 'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium'
  if (v === 'Actif')   return `${base} bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200`
  if (v === 'Inactif') return `${base} bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200`
  return `${base} bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200`
}

async function submit(){
  error.value = null
  if (!form.value.nom || !form.value.email) {
    error.value = 'Nom et email sont obligatoires.'
    return
  }
  saving.value = true
  try {
    await teachers.createOne({
      nom: form.value.nom,
      prenom: form.value.prenom || '',
      email: form.value.email,
      matiere: form.value.matiere || '',
      statut: form.value.statut || 'Actif',
    })
    await teachers.fetch()
    openModal.value = false
    form.value = { nom:'', prenom:'', email:'', matiere:'', statut:'Actif' }
  } catch (e) {
    error.value = e?.message || 'Erreur lors de la création'
  } finally {
    saving.value = false
  }
}

async function remove(id){
  if (!confirm('Supprimer ce professeur ?')) return
  await teachers.removeOne(id)
  await teachers.fetch()
}

function printPage(){ window.print() }
function exportCsv(){
  const header = ['id','nom','prenom','email','matiere','statut']
  const lines = rows.value.map(t => [
    t.id, `"${t.nom || ''}"`, `"${t.prenom || ''}"`, `"${t.email || ''}"`, `"${t.matiere || ''}"`, `"${t.statut || ''}"`
  ].join(','))
  const csv = [header.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'professeurs.csv'; a.click()
  URL.revokeObjectURL(url)
}
</script>
