<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold">Élèves</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Liste des élèves par classe. Recherche et export CSV.
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
          Nouvel élève
        </button>
      </div>
    </div>

    <!-- Filtres -->
    <div class="grid gap-3 md:grid-cols-3">
      <input
        v-model="q"
        type="search"
        placeholder="Rechercher (nom, matricule)…"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      />
      <select
        v-model.number="classeId"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      >
        <option value="">Toutes classes</option>
        <option v-for="c in classes" :key="c.id" :value="c.id">
          {{ c.libelle || c.label || c.code }}
        </option>
      </select>
      <div class="flex items-center gap-2">
        <span class="text-xs text-slate-500 dark:text-slate-400">Total: {{ rows.length }}</span>
      </div>
    </div>

    <!-- États -->
    <div v-if="students.loading" class="rounded-xl border border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      Chargement…
    </div>
    <div v-else-if="rows.length === 0" class="rounded-xl border border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      Aucun élève trouvé.
    </div>

    <!-- Mobile: cartes -->
    <div v-else class="md:hidden divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div v-for="e in rows" :key="e.id" class="p-3">
        <div class="flex items-center justify-between">
          <div class="min-w-0">
            <div class="truncate text-sm font-medium">{{ e.nom }}</div>
            <div class="text-xs text-slate-500 dark:text-slate-400">{{ e.matricule }} — {{ classeLabel(e.classeId) }}</div>
          </div>
          <div class="shrink-0">
            <button
              class="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
              @click="remove(e.id)"
            >
              Supprimer
            </button>
          </div>
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
              <th class="px-4 py-3 font-medium">Matricule</th>
              <th class="px-4 py-3 font-medium">Classe</th>
              <th class="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="e in rows"
              :key="e.id"
              class="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
            >
              <td class="px-4 py-3">{{ e.nom }}</td>
              <td class="px-4 py-3">{{ e.matricule }}</td>
              <td class="px-4 py-3">{{ classeLabel(e.classeId) }}</td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-2">
                  <RouterLink
                    :to="`/etudiants/detail?id=${e.id}`"
                    class="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    Détails
                  </RouterLink>
                  <button
                    class="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
                    @click="remove(e.id)"
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

    <!-- MODALE: Nouvel élève -->
    <Modal v-model="openModal">
      <template #title><h3 class="text-base font-semibold">Nouvel élève</h3></template>

      <form class="space-y-3" @submit.prevent="submit">
        <div class="grid gap-3 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Nom complet</label>
            <input v-model="form.nom" type="text" required
                   class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900" />
          </div>
          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Matricule</label>
            <input v-model="form.matricule" type="text"
                   class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900" />
          </div>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Classe</label>
            <select v-model.number="form.classeId" required
                    class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900">
              <option value="">— Classe —</option>
              <option v-for="c in classes" :key="c.id" :value="c.id">
                {{ c.libelle || c.label || c.code }}
              </option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs text-slate-500 dark:text-slate-400">Photo (URL)</label>
            <input v-model="form.photoUrl" type="url"
                   class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900" />
          </div>
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
import { useStudents } from '@/stores/useStudents'
import { useClasses } from '@/stores/useClasses'

const students = useStudents()
const classesStore = useClasses()

const q = ref('')
const classeId = ref('')

const openModal = ref(false)
const saving = ref(false)
const error = ref(null)
const form = ref({ nom: '', matricule: '', classeId: '', photoUrl: '' })

onMounted(async () => {
  await Promise.all([classesStore.fetch(), students.fetch()])
})

const classes = computed(() => classesStore.items || [])
const classById = computed(() => classesStore.byId || {})

const rows = computed(() => {
  const term = q.value.trim().toLowerCase()
  return (students.items || []).filter(e => {
    if (classeId.value && Number(e.classeId) !== Number(classeId.value)) return false
    if (!term) return true
    const hay = `${e.nom || ''} ${e.matricule || ''}`.toLowerCase()
    return hay.includes(term)
  })
})

const total = computed(() => students.items?.length || 0)
const classeLabel = (id) => {
  const c = classById.value[id]
  return c ? (c.libelle || c.label || c.code) : '—'
}

async function submit(){
  error.value = null
  if (!form.value.nom || !form.value.classeId) {
    error.value = 'Nom et classe sont obligatoires.'
    return
  }
  saving.value = true
  try {
    await students.createOne({
      nom: form.value.nom,
      matricule: form.value.matricule || '',
      classeId: Number(form.value.classeId),
      photoUrl: form.value.photoUrl || '',
    })
    await students.fetch()
    openModal.value = false
    form.value = { nom: '', matricule: '', classeId: '', photoUrl: '' }
  } catch (e) {
    error.value = e?.message || 'Erreur lors de la création'
  } finally {
    saving.value = false
  }
}

async function remove(id){
  if (!confirm('Supprimer cet élève ?')) return
  await students.removeOne(id)
  await students.fetch()
}

function printPage(){ window.print() }
function exportCsv(){
  const header = ['id','nom','matricule','classe']
  const lines = rows.value.map(e => [
    e.id,
    `"${e.nom || ''}"`,
    `"${e.matricule || ''}"`,
    `"${classeLabel(e.classeId)}"`,
  ].join(','))
  const csv = [header.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'eleves.csv'; a.click()
  URL.revokeObjectURL(url)
}
</script>
