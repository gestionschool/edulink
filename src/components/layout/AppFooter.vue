<!-- components/layout/AppFooter.vue -->
<template>
  <footer
    class="w-full border-t border-gray-200 bg-white px-4 py-3 text-xs text-gray-500
           dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
  >
    <div class="flex flex-col sm:flex-row items-center justify-between gap-2">
      <p>
        © {{ new Date().getFullYear() }} <span class="font-semibold">{{ appName }}</span>. Tous droits réservés.
      </p>
      <p>
        v{{ version }}
      </p>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  appName: { type: String, default: 'Edulink' },
  version: { type: String, default: '1.0' }
})
</script>
