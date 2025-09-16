<template>
  <div class="relative inline-block text-left" ref="root" @keydown.esc.stop.prevent="close">
    <!-- Déclencheur -->
    <div @click="toggle" :aria-haspopup="'menu'" :aria-expanded="open.toString()">
      <slot name="trigger" :open="open" :toggle="toggle" />
    </div>

    <!-- Menu -->
    <transition name="fade-scale">
      <div
        v-if="open"
        ref="menu"
        class="absolute z-50 mt-2 min-w-[12rem]"
        :class="align === 'left' ? 'left-0' : 'right-0'"
        role="menu" aria-orientation="vertical"
        @keydown.down.prevent="focusNext" @keydown.up.prevent="focusPrev"
      >
        <div class="rounded-md border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5
                    dark:border-gray-700 dark:bg-gray-800">
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, provide } from 'vue'

const props = defineProps({
  align: { type: String, default: 'right' },          // 'left' | 'right'
  closeOnItemClick: { type: Boolean, default: true }
})
const emit = defineEmits(['open-change'])

const open = ref(false)
const root = ref(null)
const menu = ref(null)

function toggle() { open.value = !open.value; changed() }
function close()  { if (open.value) { open.value = false; emit('open-change', false) } }
function openMenu(){ if (!open.value) { open.value = true; changed() } }

function changed() {
  emit('open-change', open.value)
  if (open.value) nextTick(focusFirst)
}

function onDocClick(e) {
  if (!root.value) return
  if (!root.value.contains(e.target)) close()
}

function focusable() {
  const nodes = menu.value?.querySelectorAll('[data-dropdown-item]')
  return nodes ? Array.from(nodes) : []
}
function focusFirst() { const items = focusable(); items[0]?.focus() }
function focusNext()  {
  const items = focusable(); if (!items.length) return
  const i = items.findIndex(el => el === document.activeElement)
  items[(i + 1) % items.length]?.focus()
}
function focusPrev()  {
  const items = focusable(); if (!items.length) return
  const i = items.findIndex(el => el === document.activeElement)
  items[(i - 1 + items.length) % items.length]?.focus()
}

provide('dropdownClose', () => { if (props.closeOnItemClick) close() })

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<style scoped>
.fade-scale-enter-active, .fade-scale-leave-active { transition: opacity .12s ease, transform .12s ease; }
.fade-scale-enter-from, .fade-scale-leave-to { opacity: 0; transform: scale(0.98); }
</style>
