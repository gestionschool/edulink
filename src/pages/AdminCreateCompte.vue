<!-- pages/AdminCreateCompte.vue -->
<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div class="mx-auto max-w-xl p-4 sm:p-6">
        <PageHeader title="Créer un compte (Admin)" />

        <form
          @submit.prevent="submit"
          class="grid gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm
                dark:border-gray-700 dark:bg-gray-800"
        >
          <label class="text-gray-700 dark:text-gray-200">
            Nom complet
            <input
              v-model="f.nom"
              class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                    text-gray-900 shadow-sm placeholder-gray-500
                    focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                    dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                    dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
              required
            />
          </label>

          <label class="text-gray-700 dark:text-gray-200">
            Email
            <input
              v-model="f.email"
              type="email"
              class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                    text-gray-900 shadow-sm placeholder-gray-500
                    focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                    dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                    dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
              required
            />
          </label>

          <label class="text-gray-700 dark:text-gray-200">
            Rôle
            <select
              v-model="f.role"
              class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                    text-gray-900 shadow-sm
                    focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                    dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100
                    dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
            >
              <option>admin</option>
              <option>professeur</option>
              <option>gestion</option>
            </select>
          </label>

          <label class="text-gray-700 dark:text-gray-200">
            Mot de passe
            <input
              v-model="f.password"
              type="password"
              class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                    text-gray-900 shadow-sm placeholder-gray-500
                    focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                    dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                    dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
              required
            />
          </label>

          <button
            class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white
                  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
                  dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400 w-fit"
          >
            Créer
          </button>

          <p v-if="message" class="text-sm mt-2"
            :class="messageType==='success'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'">
            {{ message }}
          </p>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import AppLayout from '@/components/layout/AppLayout.vue'


const f = ref({ nom: '', email: '', role: 'professeur', password: '' })
const message = ref('')
const messageType = ref('success')

async function submit () {
  try {
    // Exemple : POST /users
    console.log('Création compte', f.value)
    message.value = `Compte ${f.value.role} créé avec succès`
    messageType.value = 'success'
    // Reset
    f.value = { nom: '', email: '', role: 'professeur', password: '' }
  } catch (e) {
    message.value = 'Erreur lors de la création du compte'
    messageType.value = 'error'
  }
}
</script>
