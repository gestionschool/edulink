<!-- src/components/layout/Sidebar.vue -->
<template>
  <div class="h-full flex flex-col">
    <!-- Brand -->
    <div class="px-4 h-16 flex items-center border-b border-gray-200 dark:border-gray-800">
      <RouterLink to="/" class="flex items-center gap-2 text-lg font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 2.309L6 8v8l6 3.309L18 16V8l-6-2.691z" />
        </svg>
        <span>Edulink</span>
      </RouterLink>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-3">
      <div v-for="section in filteredSections" :key="section.title" class="px-3 py-2">
        <div class="px-2 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {{ section.title }}
        </div>
        <div class="space-y-1">
          <NavItem
            v-for="item in section.items"
            :key="item.to"
            :to="item.to"
            :prefix="item.prefix"
            :label="item.label"
            :icon="item.icon"
            @navigate="emitNavigate"
          />
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/useAuth'
import NavItem from './NavItem.vue'

// Définition du menu + rôles autorisés par item
// Omettre 'roles' => visible par tous
const sections = [
  {
    title: 'Général',
    items: [
      { to: '/dashboard',  prefix: '/dashboard',  label: 'Tableau de bord', icon: 'home' },
      { to: '/professeurs',prefix: '/professeurs',label: 'Professeurs',     icon: 'users' },
      { to: '/etudiants',  prefix: '/etudiants',  label: 'Étudiants',       icon: 'student' },
      { to: '/classes',    prefix: '/classes',    label: 'Classes',         icon: 'classroom' }
    ]
  },
  {
    title: 'Pédagogie',
    items: [
      { to: '/cours',    prefix: '/cours',    label: 'Cours',          icon: 'book' },
      { to: '/devoirs',  prefix: '/devoirs',  label: 'Devoirs',        icon: 'task' },
      { to: '/interros', prefix: '/interros', label: 'Interrogations', icon: 'quiz' }
    ]
  },
  {
    title: 'Périodicité',
    items: [
      // Périodicité accessible à admin + gestion
      { to: '/admin/periodes',  prefix: '/admin/periodes',  label: 'Périodes',  icon: 'calendar', roles: ['admin', 'gestion'] },
      { to: '/admin/semestres', prefix: '/admin/semestres', label: 'Semestres', icon: 'calendar', roles: ['admin', 'gestion'] }
    ]
  },
  {
    title: 'Administration',
    items: [
      // Admin only
      { to: '/admin/utilisateurs', prefix: '/admin/utilisateurs', label: 'Utilisateurs',    icon: 'shield', roles: ['admin'] },
      { to: '/admin/creer-compte', prefix: '/admin/creer-compte', label: 'Créer un compte', icon: 'plus',   roles: ['admin'] }
    ]
  }
]

// Rôle actuel (Pinia)
const auth = useAuthStore()
const currentRole = computed(() => auth.user?.role || 'gestion')

// Filtrage des sections/items selon le rôle
const filteredSections = computed(() =>
  sections
    .map(sec => ({
      ...sec,
      items: sec.items.filter(item => {
        if (!item.roles) return true // visible par tous
        return item.roles.includes(currentRole.value)
      })
    }))
    .filter(sec => sec.items.length > 0)
)

function emitNavigate() {
  // Le parent AppLayout peut fermer le drawer mobile au clic (sur mobile)
}
</script>
