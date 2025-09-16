<!-- components/layout/AppLayout.vue -->
<template>
  <div class="h-screen bg-slate-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
    <div class="flex h-full">
      <!-- Sidebar desktop -->
      <aside class="hidden md:block w-64 lg:w-72 shrink-0 border-r border-gray-200 dark:border-neutral-800">
        <Sidebar @navigate="closeIfMobile" />
      </aside>

      <!-- Drawer mobile -->
      <transition name="fade">
        <div
          v-if="sidebarOpen"
          class="fixed inset-0 z-40 bg-black/50 md:hidden"
          @click.self="sidebarOpen = false"
        >
          <aside
            class="absolute inset-y-0 left-0 w-72 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 shadow-xl"
          >
            <Sidebar @navigate="sidebarOpen = false" />
          </aside>
        </div>
      </transition>

      <!-- Colonne principale -->
      <div class="flex-1 min-w-0 flex flex-col min-h-0">
        <Navbar
          :dark="isDark"
          @toggle-sidebar="sidebarOpen = true"
          @toggle-theme="toggleTheme"
        />

        <!-- Contenu scrollable -->
        <main class="flex-1 min-h-0 overflow-auto">
          <!-- Si tu utilises le layout comme wrapper globale, laisse <slot/> -->
          <slot />
          <!-- Ou si tu veux le layout piloter le router directement:
          <router-view />
          -->
        </main>

        <!-- Footer en bas -->
        <AppFooter appName="Edulink" version="1.0" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'
import AppFooter from './AppFooter.vue'

const sidebarOpen = ref(false)
const isDark = ref(false)

function applyTheme(dark) {
  document.documentElement.classList.toggle('dark', dark)
}

function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function closeIfMobile() {
  sidebarOpen.value = false
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  isDark.value = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme(isDark.value)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
