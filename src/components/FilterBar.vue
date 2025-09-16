<!-- components/FilterBar.vue -->
<template>
  <div class="mb-4 grid gap-2 sm:flex sm:items-center">
    <input
      v-model="localValue.q"
      placeholder="Recherche…"
      class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 
             text-gray-900 placeholder-gray-500 shadow-sm 
             focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
             dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 
             dark:placeholder-gray-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
    />
    <slot />
    <button
      @click="$emit('reset')"
      class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium 
             text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500
             dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-indigo-400"
    >
      Réinitialiser
    </button>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({ q: '' }) }
})
const emit = defineEmits(['update:modelValue', 'reset'])

const localValue = reactive({ ...props.modelValue })
watch(localValue, (val) => emit('update:modelValue', val))
</script>
