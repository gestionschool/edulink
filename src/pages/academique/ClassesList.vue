<template>
  <section class="space-y-6">
    <PageHeader
      title="Classes"
      subtitle="Gestion des classes (niveau, filière, titulaire, effectif)"
    >
      <template #actions>
        <RouterLink
          to="/classes/nouveau"
          class="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 dark:border-violet-900"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>
          Nouvelle classe
        </RouterLink>
      </template>
    </PageHeader>

    <!-- Filtres -->
    <Toolbar>
      <label class="sr-only" for="q">Recherche</label>
      <input
        id="q"
        v-model="q"
        type="search"
        placeholder="Rechercher (code, libellé, titulaire)…"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
               focus:border-violet-500 focus:ring-1 focus:ring-violet-500
               dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      />

      <label class="sr-only" for="niv">Niveau</label>
      <select
        id="niv"
        v-model="filtreNiveau"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
               focus:border-violet-500 focus:ring-1 focus:ring-violet-500
               dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      >
        <option value="">Tous niveaux</option>
        <option v-for="n in niveauxOptions" :key="n" :value="n">{{ n }}</option>
      </select>

      <label class="sr-only" for="fil">Filière</label>
      <select
        id="fil"
        v-model="filtreFiliere"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
               focus:border-violet-500 focus:ring-1 focus:ring-violet-500
               dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      >
        <option value="">Toutes filières</option>
        <option v-for="f in filieresOptions" :key="f" :value="f">{{ f }}</option>
      </select>
    </Toolbar>

    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <StateBlock
        :loading="store.loading"
        :error="store.error?.message || store.error"
        :empty="rows.length === 0"
        empty-text="Aucune classe trouvée."
      >
        <!-- Mobile -->
        <ul class="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
          <ClassCard v-for="c in rows" :key="'m-'+c.id" :item="c" @remove="remove" />
        </ul>

        <!-- Desktop -->
        <div class="hidden md:block">
          <ClassTable :items="rows" :total="total" @remove="remove" />
        </div>
      </StateBlock>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useClassesStore } from '@/stores/useClasses'

import PageHeader from '@/components/layout/PageHeader.vue'
import Toolbar    from '@/components/ui/Toolbar.vue'
import StateBlock from '@/components/ui/StateBlock.vue'
import ClassCard  from '@/components/classes/ClassCard.vue'
import ClassTable from '@/components/classes/ClassTable.vue'

const store = useClassesStore()

// Filtres
const q = ref('')
const filtreNiveau  = ref('')
const filtreFiliere = ref('')

// Charger
onMounted(() => {
  store.list?.() ?? store.fetch?.()
})

// Options dynamiques
const niveauxOptions = computed(() =>
  Array.from(new Set((store.items || []).map(c => c.niveau).filter(Boolean))).sort()
)
const filieresOptions = computed(() =>
  Array.from(new Set((store.items || []).map(c => c.filiere).filter(Boolean))).sort()
)

// Filtrage client (MVP)
const rows = computed(() => {
  const term = q.value.trim().toLowerCase()
  return (store.items || []).filter(c => {
    if (filtreNiveau.value && c.niveau !== filtreNiveau.value) return false
    if (filtreFiliere.value && c.filiere !== filtreFiliere.value) return false
    if (!term) return true
    const hay = `${c.code} ${c.libelle || c.label} ${c.titulaire || ''}`.toLowerCase()
    return hay.includes(term)
  })
})

const total = computed(() => store.items?.length || 0)

// Suppression
async function remove(id){
  if (!confirm('Supprimer cette classe ?')) return
  const del = store.remove?.bind(store) || store.removeOne?.bind(store)
  await del(id)
  await (store.list?.() ?? store.fetch?.())
}
</script>
