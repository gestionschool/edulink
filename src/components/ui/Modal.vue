<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="modelValue" class="fixed inset-0 z-[100]">
        <div class="absolute inset-0 bg-black/40" @click="close"></div>

        <div class="relative z-10 mx-auto my-8 w-full max-w-lg px-3">
          <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
              <slot name="title">
                <h3 class="text-base font-semibold">Modal</h3>
              </slot>
              <button
                class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                @click="close"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <div class="px-4 py-4">
              <slot />
            </div>

            <div class="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3 dark:border-slate-800">
              <slot name="actions">
                <button
                  class="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
                  @click="close"
                >
                  Fermer
                </button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue'])

function close(){ emit('update:modelValue', false) }
function onKey(e){ if (e.key === 'Escape') close() }

onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
