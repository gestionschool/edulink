<template>
  <component
    :is="to ? RouterLink : 'div'"
    :to="to"
    class="group block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
  >
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs text-slate-500 dark:text-slate-400">{{ title }}</p>
        <div v-if="loading" class="mt-2 h-6 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
        <p v-else class="mt-1 text-2xl font-semibold">{{ value ?? '—' }}</p>
      </div>
      <div class="rounded-xl bg-violet-50 p-2 text-violet-700 dark:bg-violet-900/30 dark:text-violet-200">
        <span class="inline-block h-6 w-6" v-html="iconSvg(icon)"></span>
      </div>
    </div>
  </component>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  title: String,
  value: [String, Number],
  icon: String,
  loading: Boolean,
  to: String
})

function iconSvg(name){
  const icons = {
    building:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18V3H3v18zm2-2V5h14v14H5zM7 7h4v4H7V7z"/></svg>',
    classroom:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 5h18v12H3zM5 7v8h14V7H5zm-2 12h18v2H3z"/></svg>',
    student:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 8l11 5 8-3.636V15h2V8L12 3Zm0 13L6 13v3.5C6 18.985 8.686 21 12 21s6-2.015 6-4.5V13l-6 3Z"/></svg>',
    users:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h10v-3.5C11 14.17 6.33 13 4 13zm12 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.93 1.97 3.45V20h5v-3.5C22 14.17 17.33 13 16 13z"/></svg>',
    book:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12V2zM6 4h10v14H6a2 2 0 0 0-2 2V4z"/></svg>',
  }
  return icons[name] ?? icons.classroom
}
</script>
