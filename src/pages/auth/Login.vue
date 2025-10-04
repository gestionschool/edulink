<!-- src/pages/auth/Login.vue -->
<template>
  <div class="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50 text-slate-900
              dark:bg-slate-950 dark:text-slate-100">
    <!-- Bandeau visuel (caché en petit écran) -->
    <aside class="relative hidden lg:flex items-center justify-center p-12 overflow-hidden">
      <div class="absolute inset-0 -z-10">
        <!-- Dégradé organique -->
        <div class="absolute -top-32 -right-40 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-30
                    bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500"></div>
        <div class="absolute -bottom-24 -left-24 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-20
                    bg-gradient-to-tr from-sky-400 via-emerald-400 to-lime-300"></div>
      </div>

      <div class="max-w-lg">
        <div class="flex items-center gap-3 mb-6">
          <svg class="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 2.309L6 8v8l6 3.309L18 16V8l-6-2.691z"/>
          </svg>
          <h1 class="text-2xl font-bold tracking-tight">Edulink</h1>
        </div>

        <h2 class="text-3xl font-semibold leading-tight mb-3">
          Plateforme de gestion scolaire
        </h2>
        <p class="text-slate-600 dark:text-slate-300">
          Centralisez les classes, élèves, professeurs et évaluations. Suivez les
          performances et générez des rapports en un clic.
        </p>

        <ul class="mt-8 space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <li class="flex items-start gap-2">
            <span class="mt-1 inline-block h-2 w-2 rounded-full bg-indigo-500"></span>
            SaaS multi-établissements
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-1 inline-block h-2 w-2 rounded-full bg-violet-500"></span>
            Présences, évaluations, bulletins
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-1 inline-block h-2 w-2 rounded-full bg-fuchsia-500"></span>
            Rapports & exports
          </li>
        </ul>
      </div>
    </aside>

    <!-- Panneau formulaire -->
    <main class="flex items-center justify-center p-6 sm:p-10">
      <section
        class="w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 backdrop-blur
               shadow-sm p-6 sm:p-8
               dark:border-slate-800 dark:bg-slate-900/80">
        <!-- Brand (mobile) -->
        <div class="lg:hidden mb-6 flex items-center justify-center gap-2">
          <svg class="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 2.309L6 8v8l6 3.309L18 16V8l-6-2.691z"/>
          </svg>
          <span class="text-xl font-semibold">Edulink</span>
        </div>

        <header class="mb-6">
          <h1 class="text-xl font-semibold">Connexion</h1>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Accédez à votre espace Edulink.
          </p>
        </header>

        <!-- Alerte erreur -->
        <div v-if="error" class="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700
                                 dark:border-red-700/60 dark:bg-red-900/30 dark:text-red-200"
             role="alert" aria-live="assertive">
          {{ error }}
        </div>

        <form @submit.prevent="onSubmit" class="space-y-4" novalidate>
          <div>
            <label for="email" class="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              v-model.trim="email"
              type="email"
              autocomplete="email"
              required
              :disabled="loading"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                     placeholder-slate-400 shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     disabled:opacity-60
                     dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500
                     dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
              placeholder="vous@ecole.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium mb-1">Mot de passe</label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                autocomplete="current-password"
                required
                :disabled="loading"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm
                       placeholder-slate-400 shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                       disabled:opacity-60
                       dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500
                       dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                placeholder="••••••••"
              />
              <button type="button"
                      @click="showPassword = !showPassword"
                      :aria-pressed="showPassword.toString()"
                      class="absolute inset-y-0 right-2 my-auto inline-flex h-8 w-8 items-center justify-center
                             rounded-md text-slate-500 hover:bg-slate-100
                             dark:text-slate-400 dark:hover:bg-slate-800">
                <svg v-if="!showPassword" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                </svg>
                <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 5.27 3.28 4 20 20.72 18.73 22l-3.2-3.2A12.2 12.2 0 0 1 12 19c-7 0-10-7-10-7a21.78 21.78 0 0 1 4.11-5.73L2 5.27zM12 7a5 5 0 0 1 5 5c0 .74-.17 1.44-.46 2.07L9.93 7.46C10.56 7.17 11.26 7 12 7z"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <label class="inline-flex items-center gap-2 text-sm select-none">
              <input type="checkbox" v-model="remember" :disabled="loading"
                     class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500
                            dark:border-slate-700 dark:bg-slate-800" />
              Se souvenir de moi
            </label>
            <a href="#" class="text-sm text-indigo-600 hover:underline dark:text-indigo-400">Mot de passe oublié ?</a>
          </div>

          <button
            type="submit"
            :disabled="disabled"
            :aria-busy="loading ? 'true' : 'false'"
            class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5
                   text-white text-sm font-medium shadow-sm transition
                   hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   dark:focus:ring-indigo-400">
            <svg v-if="loading" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4z"/>
            </svg>
            <span>{{ loading ? 'Connexion…' : 'Se connecter' }}</span>
          </button>

          <!-- Bouton démo (facultatif) -->
          <button type="button" @click="fillDemo" :disabled="loading"
                  class="w-full inline-flex items-center justify-center gap-2 rounded-lg border mt-2
                         border-slate-300 bg-white py-2.5 text-sm font-medium
                         hover:bg-slate-50
                         dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-800/70">
            Remplir avec un compte démo
          </button>
        </form>

        <p class="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Conseil : configure <code class="font-mono">VITE_API_URL</code> pour ton environnement.
        </p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const remember = ref(true)
const showPassword = ref(false)

const loading = computed(() => auth.loading)
const error = computed(() => auth.error)
const disabled = computed(() => !email.value || !password.value || loading.value)

function loadRemembered() {
  const saved = localStorage.getItem('edulink_last_email')
  if (saved) {
    email.value = saved
    remember.value = true
  }
}

function persistRemembered() {
  if (remember.value) localStorage.setItem('edulink_last_email', email.value)
  else localStorage.removeItem('edulink_last_email')
}

async function onSubmit() {
  try {
    await auth.login(email.value, password.value)
    persistRemembered()
    const redirect = (route.query.redirect && String(route.query.redirect)) || { name: 'dashboard' }
    console.log("login redirect : ",redirect);
    console.log('[GUARD]', {
      to: to.fullPath,
      public: !!to.meta?.public,
      authRequired: !!(to.meta?.auth || to.meta?.roles),
      isLoggedIn: auth.isLoggedIn,
      role: auth.user?.role,
      allowed: to.meta?.roles
    })
    
    router.replace(redirect)
  } catch (_) {
    // l’erreur est déjà posée dans le store (auth.error)
  }
}

// Remplissage rapide pour tester
function fillDemo() {
  email.value = 'admin@demo.test'
  password.value = 'demo'
}

onMounted(loadRemembered)
</script>

<!-- Tailwind gère le dark en mode 'media' (auto). 
     Si ton projet utilise darkMode:'class', veille à poser la classe 'dark' sur <html>. -->
<style scoped>
/* Rien d'obligatoire ici, tout est Tailwind */
</style>
