// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuth'
import { ROLES } from '@/types/roles'

// Layout
const AppLayout = () => import('@/components/layout/AppLayout.vue')

// Auth & NotFound
const Login    = () => import('@/pages/auth/Login.vue')
const NotFound = () => import('@/pages/NotFound.vue')

// ---------- MVP PAGES ----------
// Dashboard
const DashboardHome       = () => import('@/pages/dashboard/DashboardHome.vue')

// Admin général
const EcolesList  = () => import('@/pages/admin/EcolesList.vue')
const UsersList   = () => import('@/pages/admin/UsersList.vue')

// Admin école / Académique
const ClassesList   = () => import('@/pages/academique/ClassesList.vue')
const Filieres      = () => import('@/pages/academique/Filieres.vue')
const Niveaux       = () => import('@/pages/academique/Niveaux.vue')
const EmploisGlobal = () => import('@/pages/academique/EmploisGlobal.vue')

// Communauté (toujours utile pour MVP admin école)
const ElevesList = () => import('@/pages/communautes/ElevesList.vue')
const ProfsList  = () => import('@/pages/communautes/ProfsList.vue')

// Pédagogie (prof & admin école)
const CoursList    = () => import('@/pages/pedagogie/CoursList.vue')
const DevoirsList  = () => import('@/pages/pedagogie/DevoirsList.vue')
const InterrosList = () => import('@/pages/pedagogie/InterrosList.vue')
const ExamensList  = () => import('@/pages/pedagogie/ExamensList.vue')
const NotesSaisie  = () => import('@/pages/pedagogie/NotesSaisie.vue')
const BulletinsList= () => import('@/pages/pedagogie/BulletinsList.vue')

// Rapports
const AcadRapports     = () => import('@/pages/rapports/AcadRapports.vue')
const PresenceRapports = () => import('@/pages/rapports/PresenceRapports.vue')

// (on garde les autres pages pour plus tard, mais **non référencées** pour ce MVP)

const routes = [
  { path: '/login', name: 'login', component: Login, meta: { public: true } },
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', redirect: '/dashboard' },

      // Dashboard commun à tous
      { path: 'dashboard', name: 'dashboard', component: DashboardHome, meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR] } },

      // 👑 Admin général
      { path: 'admin/ecoles',       name: 'ecoles-list', component: EcolesList, meta: { roles: [ROLES.ADMIN_GENERALE] } },
      { path: 'admin/utilisateurs', name: 'users-list',  component: UsersList,  meta: { roles: [ROLES.ADMIN_GENERALE] } },

      // 🏫 Admin école / 📚 Académique
      { path: 'classes',   name: 'classes-list', component: ClassesList,   meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE] } },
      { path: 'filieres',  name: 'filieres',     component: Filieres,      meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE] } },
      { path: 'niveaux',   name: 'niveaux',      component: Niveaux,       meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE] } },
      { path: 'emplois',   name: 'emplois',      component: EmploisGlobal, meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE] } },

      // 👨‍🏫 Professeur (et admin école pour supervision)
      { path: 'cours',    name: 'cours-list',    component: CoursList,    meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR] } },
      { path: 'devoirs',  name: 'devoirs-list',  component: DevoirsList,  meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR] } },
      { path: 'interros', name: 'interros-list', component: InterrosList, meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR] } },
      { path: 'examens',  name: 'examens-list',  component: ExamensList,  meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR] } },
      { path: 'notes',    name: 'notes-saisie',  component: NotesSaisie,  meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR] } },
      { path: 'bulletins',name: 'bulletins',     component: BulletinsList,meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR] } },


      // 👥 Communauté (toujours utile pour admin école)
      { path: 'communautes/etudiants', name: 'etudiants', component: ElevesList, meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE] } },
      { path: 'communautes/professeurs', name: 'professeurs', component: ProfsList, meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE] } },


      // 📊 Rapports
      { path: 'rapports/academiques', name: 'rapports-acad', component: AcadRapports,     meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE] } },
      { path: 'rapports/presences',   name: 'rapports-pres', component: PresenceRapports, meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE] } },
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound, meta: { public: true } }
]

const BASE = import.meta.env.BASE_URL || '/edulink/'

// export nommé + default
export const router = createRouter({
  history: createWebHistory(BASE),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

// Route d’accueil par rôle — DOIT être autorisée par meta.roles
const HOME_BY_ROLE = {
  [ROLES.ADMIN_GENERALE]: '/dashboard',
  [ROLES.ADMIN_ECOLE]: '/dashboard',
  [ROLES.PROFESSEUR]: '/cours',        // autorisé pour prof
  [ROLES.ELEVE]: '/devoirs',           // autorisé pour élève
  [ROLES.PARENT_TUTEUR]: '/devoirs',   // autorisé pour parent
}

// utilitaire anti-boucle
function redirectIfDifferent(to, next, target) {
  if (to.path === target) return next()      // pas de redirect vers la même route
  return next({ path: target, replace: true })
}

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // 1) Routes publiques (ex: /login)
  if (to.meta?.public) {
    // si déjà loggé et on visite /login, redirige vers la home par rôle
    if (to.name === 'login' && auth.isLoggedIn) {
      const home = HOME_BY_ROLE[auth.user.role] || '/dashboard'
      return redirectIfDifferent(to, next, home)
    }
    return next()
  }

  // 2) Auth requise
  if (!auth.isLoggedIn) {
    // on garde la cible pour après login
    return next({ name: 'login', query: { redirect: to.fullPath }, replace: true })
  }

  // 3) Autorisations par rôle
  const allowed = to.meta?.roles
  if (!allowed || allowed.includes(auth.user.role)) {
    return next()
  }

  // 4) Rôle pas autorisé -> route d’accueil du rôle (toujours autorisée)
  const fallback = HOME_BY_ROLE[auth.user.role] || '/dashboard'
  return redirectIfDifferent(to, next, fallback)
})

export default router
