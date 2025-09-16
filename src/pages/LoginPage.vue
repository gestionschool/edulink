<!-- pages/LoginPage.vue -->
<template>
  <div
    class="min-h-screen grid place-items-center bg-gray-50 dark:bg-gray-900 transition-colors"
  >
    <form
      @submit.prevent="login"
      class="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow
             dark:border-gray-700 dark:bg-gray-800 transition-colors"
    >
      <!-- Titre -->
      <h1 class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
        Connexion
      </h1>

      <!-- Email -->
      <label class="mb-2 block text-gray-700 dark:text-gray-200">
        Email
        <input
          v-model="email"
          type="email"
          class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm 
                 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 
                 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
          required
        />
      </label>

      <!-- Mot de passe -->
      <label class="mb-4 block text-gray-700 dark:text-gray-200">
        Mot de passe
        <input
          v-model="password"
          type="password"
          class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm
                 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 
                 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
          required
        />
      </label>

      <!-- Bouton -->
      <button
        class="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white
               hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
               dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400"
      >
        Se connecter
      </button>

      <!-- Erreur -->
      <p v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

async function login() {
  try {
    router.push('/dashboard')
  } catch (e) {
    error.value = 'Identifiants invalides'
  }
}
</script>
