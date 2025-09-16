// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuth'

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
const NotFound             = () => import('@/pages/NotFound.vue')

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, saved) {
    return saved ?? { top: 0 }
  },
  routes: [
    { path: '/', component: LoginPage, meta: { public: true } },

    { path: '/dashboard', component: DashboardHome },
    { path: '/professeurs', component: ProfesseursList },
    { path: '/etudiants', component: EtudiantsList },
    { path: '/cours', component: CoursList },
    { path: '/classes', component: ClassesList },
    { path: '/devoirs', component: DevoirsList },
    { path: '/interros', component: InterrosList },
    { path: '/examens', component: ExamensList },

    // Admin / Gestion
    { path: '/admin/creer-compte',  component: AdminCreateCompte,  meta: { roles: ['admin'] } },
    { path: '/admin/utilisateurs',  component: AdminUsersList,     meta: { roles: ['admin'] } },
    { path: '/admin/periodes',      component: AdminPeriodesList,  meta: { roles: ['admin','gestion'] } },
    { path: '/admin/semestres',     component: AdminSemestresList, meta: { roles: ['admin','gestion'] } },

    // 404 (toujours en dernier)
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  ],
})

// Guard global: auth + rôles
router.beforeEach((to) => {
  const auth = useAuthStore()
  const isPublic = to.meta?.public === true
  const isLoggedIn = !!auth.user

  // Si on est loggé et qu'on va sur la page de login => dashboard
  if (isLoggedIn && to.path === '/') {
    return { path: '/dashboard', replace: true }
  }

  // Si la route n'est pas publique et qu'on n'est pas loggé => login (avec next)
  if (!isPublic && !isLoggedIn) {
    return { path: '/', query: { next: to.fullPath }, replace: true }
  }

  // Vérif rôles si défini sur la route
  const allowed = to.meta?.roles
  const role = auth.user?.role || 'gestion'
  if (Array.isArray(allowed) && !allowed.includes(role)) {
    // accès refusé => dashboard
    return { path: '/dashboard', replace: true }
  }

  // ok
  return true
})

export default router
