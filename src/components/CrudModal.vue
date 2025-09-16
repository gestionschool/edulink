<!-- components/CrudModal.vue -->
<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4"
  >
    <div
      class="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-4 shadow-lg
             dark:border-gray-700 dark:bg-gray-900"
    >
      <!-- Titre -->
      <h3 class="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {{ title }}
      </h3>

      <!-- Formulaire -->
      <form @submit.prevent="$emit('submit')">
        <slot />

        <!-- Boutons -->
        <div class="mt-4 flex justify-end gap-2">
          <button
            type="button"
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium
                   text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500
                   dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-indigo-400"
            @click="$emit('close')"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white
                   hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
                   dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
defineProps({
  open: Boolean,
  title: String
})
</script>
