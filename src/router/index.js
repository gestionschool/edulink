// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore, ROLES } from '@/stores/useAuth'
import { useAcl } from '@/composables/useAcl'

// Lazy load (meilleure perf)
const LoginPage            = () => import('@/pages/LoginPage.vue')
const DashboardHome        = () => import('@/pages/DashboardHome.vue')
const ProfesseursList      = () => import('@/pages/ProfesseursList.vue')
const EtudiantsList        = () => import('@/pages/EtudiantsList.vue')
const CoursList            = () => import('@/pages/CoursList.vue')
const ClassesList          = () => import('@/pages/ClassesList.vue')
const DevoirsList          = () => import('@/pages/DevoirsList.vue')
const InterrosList         = () => import('@/pages/InterrosList.vue')
const ExamensList          = () => import('@/pages/ExamensList.vue')
const AdminCreateCompte    = () => import('@/pages/admin/AdminCreateCompte.vue')
const AdminUsersList       = () => import('@/pages/admin/AdminUsersList.vue')
const AdminPeriodesList    = () => import('@/pages/admin/AdminPeriodesList.vue')
const AdminSemestresList   = () => import('@/pages/admin/AdminSemestresList.vue')
const AdminEcolesList      = () => import('@/pages/admin/AdminEcolesList.vue')       // ← NOUVELLE
const SetupWizard          = () => import('@/pages/admin/SetupWizard.vue')           // ← NOUVELLE
const BulletinDetail       = () => import('@/pages/BulletinDetail.vue')
const NotFound             = () => import('@/pages/NotFound.vue')

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, saved) {
    return saved ?? { top: 0 }
  },
  routes: [
    { path: '/', component: LoginPage, meta: { public: true } },

    { path: '/dashboard', component: DashboardHome, meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR, ROLES.ELEVE] } },

    // Référentiels
    { path: '/professeurs', component: ProfesseursList, meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE] } },
    { path: '/etudiants',   component: EtudiantsList,  meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE] } },
    { path: '/classes',     component: ClassesList,    meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR] } },

    // Pédagogie
    { path: '/cours',       component: CoursList,      meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR, ROLES.ELEVE] } },
    { path: '/devoirs',     component: DevoirsList,    meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR, ROLES.ELEVE] } },
    { path: '/interros',    component: InterrosList,   meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR, ROLES.ELEVE] } },
    { path: '/examens',     component: ExamensList,    meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE, ROLES.PROFESSEUR, ROLES.ELEVE] } },

    // Structure (Direction) & Admin générale
    { path: '/admin/periodes',     component: AdminPeriodesList,  meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE] } },
    { path: '/admin/semestres',    component: AdminSemestresList, meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE] } },
    { path: '/admin/utilisateurs', component: AdminUsersList,     meta: { roles: [ROLES.ADMIN_GENERALE] } },
    { path: '/admin/creer-compte', component: AdminCreateCompte,  meta: { roles: [ROLES.ADMIN_GENERALE] } },
    { path: '/admin/ecoles',       component: AdminEcolesList,    meta: { roles: [ROLES.ADMIN_GENERALE] } }, // ← NOUVEAU

    // Wizard de configuration (Direction)
    { path: '/setup', component: SetupWizard, meta: { roles: [ROLES.ADMIN_GENERALE, ROLES.ADMIN_ECOLE] } }, // ← NOUVEAU


    // --- Bulletins ---
    // Lecture (tout utilisateur connecté : élève voit le sien, prof/direction/admin voient selon périmètre)
    {
      path: '/bulletin/:eleveId/:periodeId',
      name: 'bulletin.show',
      component: BulletinDetail,
      meta: { requiresAuth: true, ability: 'readPedago' }
    },
    // Édition (réservée prof / direction / admin générale)
    {
      path: '/bulletin/:eleveId/:periodeId/edit',
      name: 'bulletin.edit',
      component: BulletinDetail, // tu peux mettre une page d’édition dédiée si tu préfères
      meta: { requiresAuth: true, ability: 'editPedago' }
    },


    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  ]
})

// Guard global: auth + rôles
router.beforeEach((to) => {
  const auth = useAuthStore()
  const isPublic = to.meta?.public === true
  const isLoggedIn = !!auth.user
  const { canReadPedago, canEditPedago } = useAcl()

  if (!isPublic && !isLoggedIn) return { path: '/', query: { next: to.fullPath }, replace: true }
  
  // Si on est loggé et qu'on va sur la page de login => dashboard
  if (isLoggedIn && to.path === '/') {
    return { path: '/dashboard', replace: true }
  }

  // Si la route n'est pas publique et qu'on n'est pas loggé => login (avec next)
  if (!isPublic && !isLoggedIn) {
    return { path: '/', query: { next: to.fullPath }, replace: true }
  }

  const allowed = to.meta?.roles
  if (Array.isArray(allowed)) {
    const role = auth.user?.role
    if (!allowed.includes(role)) return { path: '/dashboard', replace: true }
  }

  // Abilities (permissions)
  const ability = to.meta?.ability
  if (ability === 'readPedago' && !canReadPedago.value) {
    return { path: '/dashboard' }
  }
  if (ability === 'editPedago' && !canEditPedago.value) {
    return { path: '/dashboard' }
  }

  // ok
  return true
})

export default router
