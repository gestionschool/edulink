<!-- src/components/layout/Sidebar.vue -->
<template>
  <div class="h-full flex flex-col">
    <!-- Brand -->
    <div class="px-4 h-16 flex items-center border-b border-gray-200 dark:border-gray-800">
      <RouterLink to="/" class="flex items-center gap-2 text-lg font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 2.309L6 8v8l6 3.309L18 16V8l-6-2.691z"/>
        </svg>
        <span>Edulink</span>
      </RouterLink>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-3">
      <div v-for="section in filteredSections" :key="section.title" class="space-y-2 mb-4">
        <!-- Titre masqué (on colle au visuel) -->
        <div class="sr-only">{{ section.title }}</div>

        <!-- Chaque item a le look “groupe” -->
        <div v-for="item in section.items" :key="item.key ?? item.to" class="space-y-1">
          <!-- Groupe avec sous-liens -->
          <template v-if="item.children?.length">
            <button
              type="button"
              @click="toggle(item.key)"
              :aria-expanded="isOpen(item.key) ? 'true' : 'false'"
              :aria-controls="`group-${item.key}`"
              class="w-full flex items-center justify-between px-4 h-12 rounded-2xl
                     text-[15px] font-semibold transition-colors
                     bg-violet-50 text-violet-700 hover:bg-violet-100
                     dark:bg-violet-900/30 dark:text-violet-200 dark:hover:bg-violet-900/50"
              :class="isAnyChildActive(item) ? 'ring-1 ring-violet-300/60 dark:ring-violet-400/30' : ''"
            >
              <span class="inline-flex items-center gap-3">
                <span class="h-5 w-5" v-html="iconSvg(item.icon)"></span>
                <span>{{ item.label }}</span>
              </span>
              <svg class="h-5 w-5 transition-transform"
                   :class="{'rotate-180': isOpen(item.key)}" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                      d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 1 1 .94 1.16l-4.24 3.36a.75.75 0 0 1-.94 0L5.21 8.39a.75.75 0 0 1 .02-1.18z"
                      clip-rule="evenodd"/>
              </svg>
            </button>

            <transition name="fade">
              <ul :id="`group-${item.key}`" v-show="isOpen(item.key)" class="pl-6 pt-2 space-y-2">
                <li v-for="child in item.children" :key="child.to">
                  <RouterLink
                    :to="child.to"
                    class="block px-4 py-2 text-[15px] rounded-md
                           text-slate-600 hover:text-violet-700 hover:bg-slate-100
                           dark:text-slate-300 dark:hover:text-violet-200 dark:hover:bg-white/5"
                    :class="isActive(child.prefix) ? 'text-violet-700 font-semibold dark:text-violet-200' : ''"
                  >
                    {{ child.label }}
                  </RouterLink>
                </li>
              </ul>
            </transition>
          </template>

          <!-- Groupe sans sous-liens (même look, navigation directe) -->
          <template v-else>
            <RouterLink
              :to="item.to"
              class="w-full flex items-center justify-between px-4 h-12 rounded-2xl
                     text-[15px] font-semibold transition-colors
                     bg-violet-50 text-violet-700 hover:bg-violet-100
                     dark:bg-violet-900/30 dark:text-violet-200 dark:hover:bg-violet-900/50"
              :class="isActive(item.prefix) ? 'ring-1 ring-violet-300/60 dark:ring-violet-400/30' : ''"
            >
              <span class="inline-flex items-center gap-3">
                <span class="h-5 w-5" v-html="iconSvg(item.icon)"></span>
                <span>{{ item.label }}</span>
              </span>
              <!-- chevron décoratif pour l’uniformité -->
              <svg class="h-5 w-5 opacity-60" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                      d="M7.22 14.28a.75.75 0 0 1 0-1.06L10.44 10 7.22 6.78a.75.75 0 1 1 1.06-1.06l3.5 3.5a.75.75 0 0 1 0 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0z"
                      clip-rule="evenodd"/>
              </svg>
            </RouterLink>
          </template>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore, ROLES } from '@/stores/useAuth'

const route = useRoute()
const auth = useAuthStore()
const currentRole = computed(() => auth.user?.role || 'gestion')

/* ---------------- MENU regroupé — logique “groupe + children” POUR TOUS ---------------- */
/* ROLES attendus : ADMIN_GENERALE, ADMIN_ECOLE, PROFESSEUR, ELEVE, PARENT_TUTEUR */
const sections = [
  // 1) Accueil
  {
    title: 'Général',
    items: [
      {
        key:'dashboard',
        label:'Dashboard',
        icon:'home',
        roles:[ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR, ROLES.ELEVE, ROLES.PARENT_TUTEUR],
        children: [
          { to:'/dashboard',           prefix:'/dashboard',           label:'Overview' },
          { to:'/dashboard/academique',prefix:'/dashboard/academique',label:'Académique' },
          { to:'/dashboard/finances',  prefix:'/dashboard/finances',  label:'Finances' }
        ]
      },
    ]
  },

  // 2) Communauté (personnes)
  {
    title: 'Communauté',
    items: [
      {
        key:'eleves',
        label:'Élèves',
        icon:'student',
        roles:[ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR],
        children: [
          { to:'/etudiants',         prefix:'/etudiants',         label:'Liste' },
          { to:'/etudiants/nouveau', prefix:'/etudiants/nouveau', label:'Ajouter' },
          { to:'/etudiants/detail',  prefix:'/etudiants/detail',  label:'Détail' }
        ]
      },
      {
        key:'professeurs',
        label:'Professeurs',
        icon:'users',
        roles:[ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE],
        children: [
          { to:'/professeurs',         prefix:'/professeurs',         label:'Liste' },
          { to:'/professeurs/nouveau', prefix:'/professeurs/nouveau', label:'Ajouter' },
          { to:'/professeurs/detail',  prefix:'/professeurs/detail',  label:'Détail' }
        ]
      },
      {
        key:'parents',
        label:'Parents / Tuteurs',
        icon:'parents',
        roles:[ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE],
        children: [
          { to:'/parents',         prefix:'/parents',         label:'Liste' },
          { to:'/parents/nouveau', prefix:'/parents/nouveau', label:'Ajouter' },
          { to:'/parents/detail',  prefix:'/parents/detail',  label:'Détail' }
        ]
      },
    ]
  },

  // 3) Gestion académique (classes, filières, niveaux, emplois du temps)
  {
    title: 'Académique',
    items: [
      {
        key:'classes',
        label:'Classes',
        icon:'classroom',
        roles:[ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR],
        children: [
          { to:'/classes',         prefix:'/classes',         label:'Liste' },
          { to:'/classes/nouveau', prefix:'/classes/nouveau', label:'Ajouter' },
          { to:'/classes/detail',  prefix:'/classes/detail',  label:'Détail' }
        ]
      },
      {
        key:'filieres',
        label:'Filières & Niveaux',
        icon:'layers',
        roles:[ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE],
        children: [
          { to:'/filieres',         prefix:'/filieres',         label:'Filières' },
          { to:'/niveaux',          prefix:'/niveaux',          label:'Niveaux' },
          { to:'/filiere-niveau',   prefix:'/filiere-niveau',   label:'Affectations' }
        ]
      },
      {
        key:'emplois',
        label:'Emplois du temps',
        icon:'calendar',
        roles:[ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR],
        children: [
          { to:'/emplois',         prefix:'/emplois',         label:'Vue globale' },
          { to:'/emplois/mes',     prefix:'/emplois/mes',     label:'Mes emplois (Prof)' },
          { to:'/emplois/classe',  prefix:'/emplois/classe',  label:'Par classe' }
        ]
      },
    ]
  },

  // 4) Pédagogie (cours + évaluations + bulletins)
  {
    title: 'Pédagogie',
    items: [
      {
        key:'cours',
        label:'Cours / Matières',
        icon:'book',
        roles:[ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR],
        children: [
          { to:'/cours',         prefix:'/cours',         label:'Liste' },
          { to:'/cours/nouveau', prefix:'/cours/nouveau', label:'Ajouter' },
          { to:'/cours/detail',  prefix:'/cours/detail',  label:'Détail' }
        ]
      },
      {
        key:'evaluations',
        label:'Évaluations',
        icon:'quiz',
        roles:[ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR],
        children: [
          { to:'/devoirs',  prefix:'/devoirs',  label:'Devoirs' },
          { to:'/interros', prefix:'/interros', label:'Interrogations' },
          { to:'/examens',  prefix:'/examens',  label:'Examens' }
        ]
      },
      {
        key:'bulletins',
        label:'Notes & Bulletins',
        icon:'bulletin',
        roles:[ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR, ROLES.ELEVE, ROLES.PARENT_TUTEUR],
        children: [
          { to:'/notes',                 prefix:'/notes',                 label:'Saisie des notes (Prof)' },
          { to:'/bulletins',             prefix:'/bulletins',             label:'Bulletins' },
          { to:'/bulletin/recherche',    prefix:'/bulletin/recherche',    label:'Recherche' }
        ]
      },
    ]
  },

  // 5) Présence & discipline
  {
    title: 'Présence & Discipline',
    items: [
      {
        key:'presences',
        label:'Présences',
        icon:'attendance',
        roles:[ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR, ROLES.PARENT_TUTEUR],
        children: [
          { to:'/presences/marque', prefix:'/presences/marque', label:'Marquer (Prof)' },
          { to:'/presences/liste',  prefix:'/presences/liste',  label:'Historique' },
          { to:'/presences/stats',  prefix:'/presences/stats',  label:'Statistiques' }
        ]
      },
      {
        key:'discipline',
        label:'Discipline',
        icon:'discipline',
        roles:[ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE],
        children: [
          { to:'/discipline/incidents', prefix:'/discipline/incidents', label:'Incidents' },
          { to:'/discipline/sanctions', prefix:'/discipline/sanctions', label:'Sanctions' }
        ]
      },
    ]
  },

  // 6) Gestion financière
  {
    title: 'Finances',
    items: [
      {
        key:'frais',
        label:'Frais scolaires',
        icon:'wallet',
        roles:[ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE],
        children: [
          { to:'/finances/frais',         prefix:'/finances/frais',         label:'Catalogue des frais' },
          { to:'/finances/frais/nouveau', prefix:'/finances/frais/nouveau', label:'Ajouter un frais' }
        ]
      },
      {
        key:'paiements',
        label:'Paiements',
        icon:'payments',
        roles:[ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PARENT_TUTEUR],
        children: [
          { to:'/finances/paiements',     prefix:'/finances/paiements',     label:'Suivi des paiements' },
          { to:'/finances/reçus',         prefix:'/finances/reçus',         label:'Reçus & états' }
        ]
      },
    ]
  },

  // 7) Ressources (bibliothèque, salles, matériels)
  {
    title: 'Ressources',
    items: [
      {
        key:'bibliotheque',
        label:'Bibliothèque',
        icon:'library',
        roles:[ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE],
        children: [
          { to:'/ressources/bibliotheque', prefix:'/ressources/bibliotheque', label:'Catalogue' },
          { to:'/ressources/prets',        prefix:'/ressources/prets',        label:'Prêts/Retours' }
        ]
      },
      {
        key:'reservations',
        label:'Réservations',
        icon:'rooms',
        roles:[ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE],
        children: [
          { to:'/ressources/salles',   prefix:'/ressources/salles',   label:'Salles' },
          { to:'/ressources/materiel', prefix:'/ressources/materiel', label:'Matériel' }
        ]
      },
    ]
  },

  // 8) Communication
  {
    title: 'Communication',
    items: [
      {
        key:'messagerie',
        label:'Messagerie',
        icon:'message',
        roles:[ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR, ROLES.PARENT_TUTEUR, ROLES.ELEVE],
        children: [
          { to:'/messages',          prefix:'/messages',          label:'Conversations' },
          { to:'/messages/nouveau',  prefix:'/messages/nouveau',  label:'Nouveau message' }
        ]
      },
      {
        key:'notifications',
        label:'Notifications',
        icon:'bell',
        roles:[ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE],
        children: [
          { to:'/notifications', prefix:'/notifications', label:'Campagnes (SMS/Email/App)' },
          { to:'/annonces',      prefix:'/annonces',      label:'Annonces générales' }
        ]
      },
    ]
  },

  // 9) Rapports & exports
  {
    title: 'Rapports',
    items: [
      {
        key:'rapports',
        label:'Rapports & Statistiques',
        icon:'chart',
        roles:[ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE],
        children: [
          { to:'/rapports/academiques', prefix:'/rapports/academiques', label:'Académiques' },
          { to:'/rapports/presences',   prefix:'/rapports/presences',   label:'Présences' },
          { to:'/rapports/financiers',  prefix:'/rapports/financiers',  label:'Financiers' },
          { to:'/rapports/exports',     prefix:'/rapports/exports',     label:'Export PDF / Excel' }
        ]
      },
    ]
  },

  // 10) Calendrier scolaire (périodes/semestres)
  {
    title: 'Calendrier',
    items: [
      {
        key:'periodes',
        label:'Périodes',
        icon:'calendar',
        roles:[ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE],
        children: [
          { to:'/admin/periodes',         prefix:'/admin/periodes',         label:'Périodes' },
          { to:'/admin/semestres',        prefix:'/admin/semestres',        label:'Semestres' }
        ]
      },
    ]
  },

  // 11) Administration (multi-tenant)
  {
    title: 'Administration',
    items: [
      {
        key:'ecoles',
        label:'Écoles',
        icon:'building',
        roles:[ROLES.ADMIN_GENERALE],
        children: [
          { to:'/admin/ecoles',         prefix:'/admin/ecoles',         label:'Écoles' },
          { to:'/admin/utilisateurs',   prefix:'/admin/utilisateurs',   label:'Utilisateurs' }
        ]
      },
      {
        key:'licences',
        label:'Licences & Facturation',
        icon:'billing',
        roles:[ROLES.ADMIN_GENERALE],
        children: [
          { to:'/admin/licences',  prefix:'/admin/licences',  label:'Abonnements' },
          { to:'/admin/factures',  prefix:'/admin/factures',  label:'Factures' }
        ]
      },
      {
        key:'creer-compte',
        label:'Créer un compte',
        icon:'plus',
        roles:[ROLES.ADMIN_GENERALE],
        children: [
          { to:'/admin/creer-compte', prefix:'/admin/creer-compte', label:'Formulaire' }
        ]
      },
    ]
  },

  // 12) Système / Configuration (par école)
  {
    title: 'Système',
    items: [
      {
        key:'setup',
        label:'Configuration',
        icon:'settings',
        roles:[ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE],
        children: [
          { to:'/setup',               prefix:'/setup',               label:'Paramètres généraux' },
          { to:'/setup/annee-scolaire',prefix:'/setup/annee-scolaire',label:'Année scolaire' },
          { to:'/setup/securite',      prefix:'/setup/securite',      label:'Sécurité & Rôles' }
        ]
      },
    ]
  },
]



/* ---------------- Filtrage par rôle ---------------- */
const filteredSections = computed(() =>
  sections
    .map(sec => ({
      ...sec,
      items: sec.items.filter(it => !it.roles || it.roles.includes(currentRole.value))
    }))
    .filter(sec => sec.items.length)
)

/* ---------------- Ouverture/fermeture des groupes ---------------- */
const groupsState = reactive({})
// index rapide: key -> item
const itemByKey = computed(() => {
  const m = {}
  sections.forEach(sec => sec.items.forEach(it => { if (it.key) m[it.key] = it }))
  return m
})

function ensureInit(key) {
  if (key in groupsState) return
  const it = itemByKey.value[key]
  groupsState[key] = !!(it?.children && isAnyChildActive(it)) // ouvert si un enfant est actif
}
function toggle(key){ ensureInit(key); groupsState[key] = !groupsState[key] }
function isOpen(key){ ensureInit(key); return !!groupsState[key] }

/* ---------------- Actifs ---------------- */
function isActive(prefix){
  if (!prefix) return false
  return route.path === prefix || route.path.startsWith(prefix + '/')
}
function isAnyChildActive(item){
  if (!item?.children?.length) return false
  return item.children.some(c => isActive(c.prefix))
}

/* Auto-sync: ouvre le bon groupe quand la route change */
watch(() => route.path, () => {
  Object.keys(itemByKey.value).forEach(k => {
    const it = itemByKey.value[k]
    if (it?.children?.length) {
      groupsState[k] = isAnyChildActive(it)
    }
  })
}, { immediate: true })

/* ---------------- Icônes inline ---------------- */
function iconSvg(name){
  const icons = {
    // existants ...
    home:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 8h-3v10H6V11H3l9-8z"/></svg>',
    users:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h10v-3.5C11 14.17 6.33 13 4 13zm12 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.93 1.97 3.45V20h5v-3.5C22 14.17 17.33 13 16 13z"/></svg>',
    student:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 8l11 5 8-3.636V15h2V8L12 3Zm0 13L6 13v3.5C6 18.985 8.686 21 12 21s6-2.015 6-4.5V13l-6 3Z"/></svg>',
    classroom:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 5h18v12H3zM5 7v8h14V7H5zm-2 12h18v2H3z"/></svg>',
    book:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12V2zM6 4h10v14H6a2 2 0 0 0-2 2V4a0 0 0 0 1 0 0z"/></svg>',
    quiz:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 18h2v2h-2v-2zm1-16C6.48 2 2 6.48 2 12h2a8 8 0 1 1 8 8v2c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 5h2v6h-2V7z"/></svg>',
    calendar:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2zm12 8H5v10h14V10z"/></svg>',
    plus:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>',

    // nouveaux ...
    parents:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm8-1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM2 20v-1c0-3 4-5 7-5s7 2 7 5v1H2Zm17-6c-1.25 0-2.4.27-3.4.73A6 6 0 0 1 22 20h-3v-1c0-2-1.03-3.57-2.34-4.58.44-.25 1.21-.42 2.34-.42Z"/></svg>',
    layers:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 1 7l11 5 9-4.09V12l-9 4-11-5v2l11 5 11-5V7L12 2z"/></svg>',
    bulletin:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V8h4.5"/><path d="M8 10h8v2H8zm0 4h8v2H8z"/></svg>',
    attendance:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 5h16v2H4zM4 9h10v2H4zm0 4h16v2H4zm0 4h10v2H4z"/></svg>',
    discipline:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 2 7v2h20V7L12 2Zm-6 7h12l-1 11H7L6 9z"/></svg>',
    wallet:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 7a2 2 0 0 1 2-2h13v2H5v2h15a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7zm14 5v4h4v-4h-4z"/></svg>',
    payments:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 7a2 2 0 0 1 2-2h16v2H4v10h16v2H4a2 2 0 0 1-2-2V7zm14 3h6v6h-6a3 3 0 0 1 0-6z"/></svg>',
    library:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h4v16H3zM9 4h4v16H9zM15 4h6v16h-6z"/></svg>',
    rooms:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v14H4zM2 20h20v2H2z"/></svg>',
    message:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v12H6l-2 2V4z"/></svg>',
    bell:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V11a6 6 0 0 0-12 0v5l-2 2h18l-2-2z"/></svg>',
    chart:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h2v18H3zM8 13h2v8H8zM13 9h2v12h-2zM18 5h2v16h-2z"/></svg>',
    building:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18V3H3v18zm2-2V5h14v14H5zM7 7h4v4H7V7z"/></svg>',
    billing:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v12H4zM6 9h12v2H6zm0 4h8v2H6z"/></svg>',
    settings:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm8.94 4a7.97 7.97 0 0 0-.26-2l2.02-1.57-2-3.46-2.4.98a8.14 8.14 0 0 0-1.73-1L14 2h-4l-.57 2.95c-.6.25-1.18.58-1.73 1l-2.4-.98-2 3.46L5.32 10a8.52 8.52 0 0 0 0 4l-2.02 1.57 2 3.46 2.4-.98c.55.42 1.13.75 1.73 1L10 22h4l.57-2.95c.6-.25 1.18-.58 1.73-1l2.4.98 2-3.46L20.68 14c.17-.65.26-1.32.26-2z"/></svg>',
  }
  return icons[name] ?? icons.home
}

</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
