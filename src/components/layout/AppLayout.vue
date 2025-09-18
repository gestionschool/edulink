<!-- src/components/layout/AppLayout.vue -->
<template>
  <div class="min-h-screen w-full bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <div class="flex">
      <!-- Sidebar desktop -->
      <aside class="hidden md:block w-72 h-screen overflow-y-auto border-r border-slate-200 dark:border-slate-800">
        <Sidebar @navigate="open=false" />
      </aside>

      <!-- Drawer mobile -->
      <transition name="fade">
        <div v-if="open" class="fixed inset-0 z-40 md:hidden flex">
          <div class="w-72 h-screen overflow-y-auto bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800">
            <Sidebar @navigate="open=false" />
          </div>
          <div class="flex-1 bg-black/40" @click="open=false" />
        </div>
      </transition>

      <!-- Content -->
      <div class="flex-1 min-h-screen flex flex-col">
        <Navbar @toggle-sidebar="open = !open" />
        <main class="flex-1 p-4 md:p-6">
          <RouterView />
        </main>
        <AppFooter class="mt-auto" appName="Edulink" version="1.0" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSchoolStore } from '@/stores/school'
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'
import AppFooter from './AppFooter.vue'
const open = ref(false)
const school = useSchoolStore()
onMounted(() => { school.init().catch(console.error) })
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .15s ease }
.fade-enter-from,.fade-leave-to{ opacity:0 }
</style>
