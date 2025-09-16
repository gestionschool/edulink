<template>
  <component
    :is="as"
    v-bind="linkProps"
    class="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100
           focus:bg-gray-100 focus:outline-none
           dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
    role="menuitem"
    data-dropdown-item
    @click="handle"
  >
    <slot />
  </component>
</template>

<script setup>
import { inject, computed } from 'vue'

const props = defineProps({
  // pour RouterLink: { as:'RouterLink', to:'/profile' }
  as: { type: [String, Object], default: 'button' },
  to: { type: [String, Object], default: null },
  href: { type: String, default: null },
  close: { type: Boolean, default: true }
})
const emit = defineEmits(['select'])

const dropdownClose = inject('dropdownClose', null)

const linkProps = computed(() => {
  if (props.as === 'a' && props.href) return { href: props.href }
  if (props.to) return { to: props.to }
  return { type: 'button' }
})

function handle(e) {
  emit('select', e)
  if (props.close && dropdownClose) dropdownClose()
}
</script>
