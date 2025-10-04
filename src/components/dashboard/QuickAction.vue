<template>
  <RouterLink
    :to="to"
    class="group inline-flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
  >
    <span class="inline-flex items-center gap-2">
      <span class="h-5 w-5" v-html="iconSvg(icon)"></span>
      <span class="font-medium">{{ label }}</span>
    </span>
    <svg class="h-4 w-4 opacity-60 transition group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M7.22 14.28a.75.75 0 0 1 0-1.06L10.44 10 7.22 6.78a.75.75 0 1 1 1.06-1.06l3.5 3.5a.75.75 0 0 1 0 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0z" clip-rule="evenodd"/>
    </svg>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  label: String,
  to: String,
  icon: String
})

function iconSvg(name){
  const icons = {
    plus:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>',
    shield:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l8 4v6c0 5-3.5 9.74-8 10-4.5-.26-8-5-8-10V6l8-4z"/></svg>',
    chart:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h2v18H3zM8 13h2v8H8zM13 9h2v12h-2zM18 5h2v16h-2z"/></svg>',
    layers:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 9l11 6 11-6-11-6zm0 9L1 18l11 6 11-6-11-6z"/></svg>',
    student:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 8l11 5 8-3.636V15h2V8L12 3Zm0 13L6 13v3.5C6 18.985 8.686 21 12 21s6-2.015 6-4.5V13l-6 3Z"/></svg>',
    book:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12V2zM6 4h10v14H6a2 2 0 0 0-2 2V4z"/></svg>',
    quiz:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 18h2v2h-2v-2zm1-16C6.48 2 2 6.48 2 12h2a8 8 0 1 1 8 8v2c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 5h2v6h-2V7z"/></svg>',
    attendance:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 5h16v2H4zM4 9h10v2H4zm0 4h16v2H4zm0 4h10v2H4z"/></svg>',
    edit:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg>',
    classroom:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 5h18v12H3zM5 7v8h14V7H5zm-2 12h18v2H3z"/></svg>',
  }
  return icons[name] ?? icons.layers
}
</script>
