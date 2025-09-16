<!-- src/pages/NotFound.vue -->
<template>
  <div class="min-h-[calc(100vh-4rem)] grid place-items-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center px-6 py-10">
      <p class="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Erreur 404</p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Oups, page introuvable
      </h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        L’URL <span class="font-mono text-gray-800 dark:text-gray-200">{{ route.fullPath }}</span> n’existe pas.
      </p>

      <div class="mt-6 flex items-center justify-center gap-3">
        <button
          class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium
                 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500
                 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus:ring-indigo-400"
          @click="goBack"
        >
          ← Revenir en arrière
        </button>

        <RouterLink
          to="/dashboard"
          class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white
                 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
                 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400"
        >
          Aller au tableau de bord
        </RouterLink>
      </div>

      <div class="mt-8 text-xs text-gray-500 dark:text-gray-400">
        Si le problème persiste, vérifie l’URL ou contacte un administrateur.
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute, RouterLink } from 'vue-router'
const router = useRouter()
const route = useRoute()
function goBack() {
  // Si pas d’historique, aller au dashboard
  if (window.history.length > 1) router.back()
  else router.push('/dashboard')
}
</script>
