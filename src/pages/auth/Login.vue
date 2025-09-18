<!-- src/pages/auth/Login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <form @submit.prevent="onLogin" class="w-full max-w-sm p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <h1 class="text-xl font-semibold mb-4">Connexion</h1>
      <input v-model="email" type="email" class="w-full mb-2 px-3 py-2 rounded border dark:bg-slate-800" placeholder="Email (ex: super@demo.test)" />
      <input v-model="password" type="password" class="w-full mb-4 px-3 py-2 rounded border dark:bg-slate-800" placeholder="Mot de passe" />
      <button class="w-full py-2 rounded bg-indigo-600 text-white">Se connecter</button>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuth'
import { ROLES } from '@/types/roles'

const email = ref('admin@demo.test')
const password = ref('demo')

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const HOME_BY_ROLE = {
  [ROLES.ADMIN_GENERALE]: '/dashboard',
  [ROLES.ADMIN_ECOLE]: '/dashboard',
  [ROLES.PROFESSEUR]: '/cours',
  [ROLES.ELEVE]: '/devoirs',
  [ROLES.PARENT_TUTEUR]: '/devoirs',
}

async function onLogin() {
  try {
    await auth.login(email.value, password.value)

    // 1) cible demandée avant login
    const requested = typeof route.query.redirect === 'string' ? route.query.redirect : null

    // 2) home sûre par rôle
    const home = HOME_BY_ROLE[auth.role] || '/dashboard'

    // 3) On tente la route demandée, sinon la home
    // NB: le guard vérifiera l’accès; en cas de refus il redirigera vers la home sans boucle
    router.replace(requested || home)
  } catch (e) {
    console.error('Login error:', e)
    // ici tu peux afficher un toast
  }
}
</script>
