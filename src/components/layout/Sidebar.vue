<!-- components/layout/Sidebar.vue -->
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
      <!-- Section Général -->
      <div class="px-3 py-2">
        <div class="px-2 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Général
        </div>
        <div class="space-y-1">
          <RouterLink :to="'/dashboard'" :class="linkClass('/dashboard')" @click="emitNavigate">
            <IconHome /><span>Tableau de bord</span>
          </RouterLink>
          <RouterLink :to="'/professeurs'" :class="linkClass('/professeurs')" @click="emitNavigate">
            <IconUsers /><span>Professeurs</span>
          </RouterLink>
          <RouterLink :to="'/etudiants'" :class="linkClass('/etudiants')" @click="emitNavigate">
            <IconStudent /><span>Étudiants</span>
          </RouterLink>
          <RouterLink :to="'/classes'" :class="linkClass('/classes')" @click="emitNavigate">
            <IconClassroom /><span>Classes</span>
          </RouterLink>
        </div>
      </div>

      <!-- Section Pédagogie -->
      <div class="px-3 py-2">
        <div class="px-2 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Pédagogie
        </div>
        <div class="space-y-1">
          <RouterLink :to="'/cours'" :class="linkClass('/cours')" @click="emitNavigate">
            <IconBook /><span>Cours</span>
          </RouterLink>
          <RouterLink :to="'/devoirs'" :class="linkClass('/devoirs')" @click="emitNavigate">
            <IconTask /><span>Devoirs</span>
          </RouterLink>
          <RouterLink :to="'/interros'" :class="linkClass('/interros')" @click="emitNavigate">
            <IconQuiz /><span>Interrogations</span>
          </RouterLink>
        </div>
      </div>

      <!-- Section Périodicité -->
      <div class="px-3 py-2">
        <div class="px-2 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Périodicité
        </div>
        <div class="space-y-1">
          <RouterLink :to="'/periodes'" :class="linkClass('/periodes')" @click="emitNavigate">
            <IconCalendar /><span>Périodes</span>
          </RouterLink>
          <RouterLink :to="'/semestres'" :class="linkClass('/semestres')" @click="emitNavigate">
            <IconCalendar /><span>Semestres</span>
          </RouterLink>
        </div>
      </div>

      <!-- Section Administration -->
      <div class="px-3 py-2">
        <div class="px-2 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Administration
        </div>
        <div class="space-y-1">
          <RouterLink :to="'/admin/users'" :class="linkClass('/admin/users')" @click="emitNavigate">
            <IconShield /><span>Utilisateurs</span>
          </RouterLink>
          <RouterLink :to="'/admin/create-compte'" :class="linkClass('/admin/create-compte')" @click="emitNavigate">
            <IconPlus /><span>Créer un compte</span>
          </RouterLink>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'

const route = useRoute()

function linkClass(prefix) {
  const active = route.path.startsWith(prefix)
  return [
    'group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    active
      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
  ]
}

function emitNavigate() {
  // Le parent AppLayout ferme le drawer mobile via @click.self sur l’overlay.
}
</script>
