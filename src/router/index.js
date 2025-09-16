// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import DashboardHome from '@/pages/DashboardHome.vue'
import ProfesseursList from '@/pages/ProfesseursList.vue'
import EtudiantsList from '@/pages/EtudiantsList.vue'
import CoursList from '@/pages/CoursList.vue'
import ClassesList from '@/pages/ClassesList.vue'
import DevoirsList from '@/pages/DevoirsList.vue'
import InterrosList from '@/pages/InterrosList.vue'
import ExamensList from '@/pages/ExamensList.vue'
import AdminCreateCompte from '@/pages/AdminCreateCompte.vue'
import AdminUsersList from '@/pages/AdminUsersList.vue'
import AdminPeriodesList from '@/pages/AdminPeriodesList.vue'
import AdminSemestresList from '@/pages/AdminSemestresList.vue'

export const router =  createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: LoginPage, meta:{ public:true }},
    { path: '/dashboard', component: DashboardHome },
    { path: '/professeurs', component: ProfesseursList },
    { path: '/etudiants', component: EtudiantsList },
    { path: '/cours', component: CoursList },
    { path: '/classes', component: ClassesList },
    { path: '/devoirs', component: DevoirsList },
    { path: '/interros', component: InterrosList },
    { path: '/examens', component: ExamensList },
    { path: '/admin/creer-compte', component: AdminCreateCompte },
    { path: '/admin/utilisateurs', component: AdminUsersList },
    { path: '/admin/periodes', component: AdminPeriodesList },
    { path: '/admin/semestres', component: AdminSemestresList },
  ]
})
