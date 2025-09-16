<!-- components/layout/Navbar.vue -->
<template>
  <header
    class="h-16 sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4
           dark:border-gray-800 dark:bg-gray-900"
  >
    <div class="flex items-center gap-2">
      <button
        class="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md
               border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500
               dark:border-gray-700 dark:hover:bg-gray-800 dark:focus:ring-indigo-400"
        @click="$emit('toggle-sidebar')"
        aria-label="Ouvrir le menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/></svg>
      </button>
      <RouterLink to="/" class="md:hidden text-sm font-semibold">Edulink</RouterLink>
    </div>

    <!--
    <div class="hidden md:flex items-center w-full max-w-lg">
      <input
        type="search"
        placeholder="Rechercher…"
        class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
               text-gray-900 shadow-sm placeholder-gray-500
               focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
               dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400
               dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
      />
    </div>
    -->

    <div class="flex items-center gap-2">
      <!-- Dropdown utilisateur -->
      <Dropdown align="right">
        <template #trigger="{ open }">
          <button
            class="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm
                   hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500
                   dark:border-gray-700 dark:hover:bg-gray-800 dark:focus:ring-indigo-400"
            :aria-expanded="open.toString()"
          >
            <span class="hidden sm:inline">{{ user.name }}</span>
            <span class="h-6 w-6 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white text-xs">
              {{ userInitials }}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-70" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </button>
        </template>

        <DropdownItem :as="'RouterLink'" :to="'/profile'">
          Profil
        </DropdownItem>
        <DropdownItem :as="'RouterLink'" :to="'/settings'">
          Paramètres
        </DropdownItem>

        <div class="my-1 border-t border-gray-200 dark:border-gray-700"></div>

        
        <DropdownItem @select="logout">
          Déconnexion
        </DropdownItem>
      </Dropdown>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import Dropdown from '@/components/ui/Dropdown.vue'
import DropdownItem from '@/components/ui/DropdownItem.vue'
import { useAuthStore } from '@/stores/useAuth'

defineProps({ dark: { type: Boolean, default: false } })

const router = useRouter()
const auth = useAuthStore()

const user = computed(() => auth.user ?? { name: 'Admin' })
const userInitials = computed(() => (user.value.name || 'A').split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase())

function logout() {
  auth.logout?.()
  router.replace('/')
}
</script>
