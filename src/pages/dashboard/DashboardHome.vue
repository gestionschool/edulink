<!-- src/pages/dashboard/DashboardHome.vue -->
<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <header
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border
             border-slate-200 bg-white p-5 shadow-sm
             dark:border-slate-800 dark:bg-slate-900"
    >
      <div>
        <h1 class="text-xl font-semibold">
          Bonjour, {{ userName }}
        </h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Tableau de bord — aperçu global
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span
          class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium
                 dark:border-slate-700 dark:bg-slate-800"
          :title="`Rôle: ${roleLabel}`"
        >
          <span class="h-2 w-2 rounded-full"
                :class="roleDotClass"></span>
          {{ roleLabel }}
        </span>

        <RouterLink
          to="/rapports/academiques"
          class="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100
                 dark:border-violet-900 dark:bg-violet-900/30 dark:text-violet-200 dark:hover:bg-violet-900/50"
        >
          Voir les rapports
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M7 10l5 5V5l-5 5z"/></svg>
        </RouterLink>
      </div>
    </header>

    <!-- KPIs -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <KpiCard v-if="isSuperAdmin" title="Écoles" :value="metrics.ecoles" icon="building" :loading="loading" to="/admin/ecoles" />
      <KpiCard title="Classes" :value="metrics.classes" icon="classroom" :loading="loading" to="/classes" />
      <KpiCard title="Élèves" :value="metrics.students" icon="student" :loading="loading" to="/communautes/etudiants" />
      <KpiCard title="Professeurs" :value="metrics.teachers" icon="users" :loading="loading" to="/communautes/professeurs" />
      <KpiCard title="Cours" :value="metrics.cours" icon="book" :loading="loading" to="/cours" />
    </section>

    <!-- À venir -->
    <section class="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <UpcomingCard
        title="Devoirs à venir"
        :items="upcoming.devoirs"
        empty-text="Aucun devoir à venir"
        icon="task"
        :loading="loading"
        to="/devoirs"
      />
      <UpcomingCard
        title="Interros à venir"
        :items="upcoming.interros"
        empty-text="Aucune interrogation à venir"
        icon="quiz"
        :loading="loading"
        to="/interros"
      />
      <UpcomingCard
        title="Examens à venir"
        :items="upcoming.examens"
        empty-text="Aucun examen à venir"
        icon="quiz"
        :loading="loading"
        to="/examens"
      />
    </section>

    <!-- Actions rapides par rôle -->
    <section
      class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm
             dark:border-slate-800 dark:bg-slate-900"
    >
      <h2 class="mb-4 text-base font-semibold">Actions rapides</h2>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Super Admin -->
        <QuickAction v-if="isSuperAdmin" label="Créer une école" to="/admin/ecoles" icon="plus" />
        <QuickAction v-if="isSuperAdmin" label="Gérer utilisateurs" to="/admin/utilisateurs" icon="shield" />
        <QuickAction v-if="isSuperAdmin" label="Rapports académiques" to="/rapports/academiques" icon="chart" />
        <!-- Admin École -->
        <QuickAction v-if="isAdminEcoleOrSuper" label="Ajouter une classe" to="/classes" icon="layers" />
        <QuickAction v-if="isAdminEcoleOrSuper" label="Inscrire un élève" to="/communautes/etudiants" icon="student" />
        <QuickAction v-if="isAdminEcoleOrSuper" label="Créer un cours" to="/cours" icon="book" />
        <QuickAction v-if="isAdminEcoleOrSuper" label="Planifier un examen" to="/examens" icon="quiz" />
        <!-- Professeur -->
        <QuickAction v-if="isProfOrAdmin" label="Marquer les présences" to="/presences/marque" icon="attendance" />
        <QuickAction v-if="isProfOrAdmin" label="Créer un devoir" to="/devoirs" icon="task" />
        <QuickAction v-if="isProfOrAdmin" label="Saisir des notes" to="/notes" icon="edit" />
        <QuickAction v-if="isProfOrAdmin" label="Voir mes classes" to="/classes" icon="classroom" />
      </div>
    </section>

    <!-- Erreur -->
    <p v-if="error" class="text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/useAuth'
import { http } from '@/services/http'
import KpiCard from '@/components/dashboard/KpiCard.vue'
import UpcomingCard from '@/components/dashboard/UpcomingCard.vue'
import QuickAction from '@/components/dashboard/QuickAction.vue'


const auth = useAuthStore()

const userName = computed(() => auth.user?.name || 'Utilisateur')
const roleLabel = computed(() => {
  const r = auth.user?.role
  if (r === 'ADMIN_GENERALE') return 'Admin général'
  if (r === 'ADMIN_ECOLE')   return 'Admin école'
  if (r === 'PROFESSEUR')    return 'Professeur'
  if (r === 'ELEVE')         return 'Élève'
  if (r === 'PARENT_TUTEUR') return 'Parent / Tuteur'
  return 'Invité'
})

const isSuperAdmin       = computed(() => auth.user?.role === 'ADMIN_GENERALE')
const isAdminEcoleOrSuper= computed(() => ['ADMIN_ECOLE','ADMIN_GENERALE'].includes(auth.user?.role))
const isProfOrAdmin      = computed(() => ['PROFESSEUR','ADMIN_ECOLE','ADMIN_GENERALE'].includes(auth.user?.role))

const roleDotClass = computed(() =>
  isSuperAdmin.value ? 'bg-violet-500' :
  isAdminEcoleOrSuper.value ? 'bg-emerald-500' :
  isProfOrAdmin.value ? 'bg-sky-500' : 'bg-slate-400'
)

// --- Données ---
const loading = ref(true)
const error   = ref(null)

const metrics = reactive({
  ecoles: 0,
  classes: 0,
  students: 0,
  teachers: 0,
  cours: 0,
})

const upcoming = reactive({
  devoirs: [],
  interros: [],
  examens: [],
})

onMounted(loadDashboard)

async function loadDashboard() {
  loading.value = true
  error.value = null
  try {
    // 1) Essaye d’utiliser des stores si disponibles (imports dynamiques)
    const stores = await loadStoresIfAny()

    // 2) KPIs
    metrics.ecoles  = await countOrFetch(stores?.ecoles,  '/ecoles')
    metrics.classes = await countOrFetch(stores?.classes, '/classes')
    metrics.students= await countOrFetch(stores?.students,'/students')
    metrics.teachers= await countOrFetch(stores?.teachers,'/teachers')
    metrics.cours   = await countOrFetch(stores?.cours,   '/cours')

    // 3) À venir (prochains 7 jours)
    upcoming.devoirs  = await nextItems(stores?.devoirs,  '/devoirs',  'dateRemise')
    upcoming.interros = await nextItems(stores?.interros, '/interros', 'date')
    upcoming.examens  = await nextItems(stores?.examens,  '/examens',  'date')
  } catch (e) {
    error.value = e?.message || 'Impossible de charger le tableau de bord.'
    console.warn('[Dashboard] load error:', e)
  } finally {
    loading.value = false
  }
}

/** Charge dynamiquement les stores si présents, sinon renvoie des champs undefined */
async function loadStoresIfAny() {
  const res = {}
  await Promise.allSettled([
    importIfExists('@/stores/useEcoles').then(m => res.ecoles   = m?.useEcoles?.()),
    importIfExists('@/stores/useClasses').then(m => res.classes = m?.useClasses?.()),
    importIfExists('@/stores/useStudents').then(m => res.students= m?.useStudents?.()),
    importIfExists('@/stores/useTeachers').then(m => res.teachers= m?.useTeachers?.()),
    importIfExists('@/stores/useCours').then(m => res.cours     = m?.useCours?.()),
    importIfExists('@/stores/useDevoirs').then(m => res.devoirs = m?.useDevoirs?.()),
    importIfExists('@/stores/useInterros').then(m => res.interros= m?.useInterros?.()),
    importIfExists('@/stores/useExamens').then(m => res.examens = m?.useExamens?.()),
  ])
  // Chaque store peut exposer ensureLoaded/fetch/list — on tente prudemment
  await Promise.allSettled([
    res.ecoles?.ensureLoaded?.(), res.classes?.ensureLoaded?.(), res.students?.ensureLoaded?.(),
    res.teachers?.ensureLoaded?.(), res.cours?.ensureLoaded?.(),
    res.devoirs?.ensureLoaded?.(), res.interros?.ensureLoaded?.(), res.examens?.ensureLoaded?.(),
  ])
  return res
}

async function importIfExists(path) {
  try { return await import(/* @vite-ignore */ path) }
  catch { return {} }
}

/** Compte via store.items || store.list || fallback API */
async function countOrFetch(store, endpoint) {
  const localCount =
    (Array.isArray(store?.items) && store.items.length) ??
    (Array.isArray(store?.list) && store.list.length)
  if (typeof localCount === 'number') return localCount
  const data = await http.get(endpoint)
  return Array.isArray(data) ? data.length : 0
}

/** Renvoie les prochains éléments (≤7 jours), triés et enrichis */
async function nextItems(store, endpoint, dateField) {
  let data = []
  if (Array.isArray(store?.items) && store.items.length) data = store.items
  else data = await http.get(endpoint)

  const today = new Date()
  const in7   = addDays(today, 7)

  return data
    .filter(it => {
      const d = new Date(it[dateField])
      return isValidDate(d) && d >= startOfDay(today) && d <= endOfDay(in7)
    })
    .sort((a, b) => new Date(a[dateField]) - new Date(b[dateField]))
    .slice(0, 5)
    .map(it => ({
      ...it,
      __extra: [
        it.classe ? `Classe: ${it.classe}` : undefined,
        it.cours  ? `Cours: ${it.cours}`   : undefined,
      ].filter(Boolean).join(' • ')
    }))
}

// --- utils formatting ---
function isValidDate(d){ return d instanceof Date && !isNaN(+d) }
function startOfDay(d){ return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0,0,0,0) }
function endOfDay(d){   return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23,59,59,999) }
function addDays(d, n){ const x = new Date(d); x.setDate(x.getDate()+n); return x }
function pad(n){ return String(n).padStart(2,'0') }
function formatDate(v){
  if (!v) return '—'
  const d = new Date(v)
  if (!isValidDate(d)) return '—'
  return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`
}

// --- icônes inline (cohérents avec ton Sidebar) ---
function iconSvg(name){
  const icons = {
    building:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18V3H3v18zm2-2V5h14v14H5zM7 7h4v4H7V7z"/></svg>',
    classroom:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 5h18v12H3zM5 7v8h14V7H5zm-2 12h18v2H3z"/></svg>',
    student:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 8l11 5 8-3.636V15h2V8L12 3Zm0 13L6 13v3.5C6 18.985 8.686 21 12 21s6-2.015 6-4.5V13l-6 3Z"/></svg>',
    users:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h10v-3.5C11 14.17 6.33 13 4 13zm12 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.93 1.97 3.45V20h5v-3.5C22 14.17 17.33 13 16 13z"/></svg>',
    book:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12V2zM6 4h10v14H6a2 2 0 0 0-2 2V4z"/></svg>',
    task:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 11h8v2H9zm0-4h8v2H9zm0 8h8v2H9zM7 7H5v2h2V7zm0 4H5v2h2v-2zm0 4H5v2h2v-2z"/></svg>',
    quiz:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 18h2v2h-2v-2zm1-16C6.48 2 2 6.48 2 12h2a8 8 0 1 1 8 8v2c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 5h2v6h-2V7z"/></svg>',
    edit:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg>',
    layers:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 9l11 6 11-6-11-6zm0 9L1 18l11 6 11-6-11-6z"/></svg>',
    chart:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h2v18H3zM8 13h2v8H8zM13 9h2v12h-2zM18 5h2v16h-2z"/></svg>',
    plus:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>',
    attendance:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 5h16v2H4zM4 9h10v2H4zm0 4h16v2H4zm0 4h10v2H4z"/></svg>',
  }
  return icons[name] ?? icons.layers
}
</script>
