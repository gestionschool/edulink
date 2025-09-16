<template>
  <RouterLink :to="to" :class="classes" @click="$emit('navigate')">
    <AppIcon v-if="icon" :name="icon" class="h-5 w-5" />
    <span>{{ label }}</span>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppIcon from '../icons/AppIcon.vue'

const props = defineProps({
  to: { type: String, required: true },
  prefix: { type: String, required: true }, // pour le matching "actif"
  label: { type: String, required: true },
  icon: { type: String, default: '' }
})
defineEmits(['navigate'])

const route = useRoute()
const isActive = computed(() => route.path.startsWith(props.prefix))
const classes = computed(() => [
  'group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
  isActive.value
    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
])
</script>
