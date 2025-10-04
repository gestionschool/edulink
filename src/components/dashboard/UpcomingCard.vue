<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="mb-3 flex items-center justify-between">
      <h3 class="text-sm font-semibold">{{ title }}</h3>
      <RouterLink v-if="to" :to="to" class="text-xs text-violet-700 hover:underline dark:text-violet-300">
        Tout voir
      </RouterLink>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="space-y-2">
      <div class="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
      <div class="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
      <div class="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
    </div>

    <!-- Liste -->
    <template v-else>
      <ul v-if="items && items.length" class="space-y-2">
        <li
          v-for="it in items"
          :key="`${title}-${it.id}`"
          class="rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-800"
        >
          <div class="flex items-center justify-between">
            <div class="flex min-w-0 items-center gap-2">
              <span
                class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                v-html="iconSvg(icon)"
              />
              <span class="truncate font-medium">{{ it.titre || it.title }}</span>
            </div>
            <span class="shrink-0 text-xs text-slate-500 dark:text-slate-400">
              {{ formatDate(it.date || it.dateRemise) }}
            </span>
          </div>
          <p v-if="it.__extra" class="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
            {{ it.__extra }}
          </p>
        </li>
      </ul>

      <p v-else class="text-sm text-slate-500 dark:text-slate-400">
        {{ emptyText }}
      </p>
    </template>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
  title: String,
  items: { type: Array, default: () => [] },
  emptyText: { type: String, default: 'Aucun élément' },
  icon: String,
  loading: Boolean,
  to: String
})

function pad(n){ return String(n).padStart(2,'0') }
function isValidDate(d){ return d instanceof Date && !isNaN(+d) }
function formatDate(v){
  if (!v) return '—'
  const d = new Date(v)
  if (!isValidDate(d)) return '—'
  return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`
}

function iconSvg(name){
  const icons = {
    task:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 11h8v2H9zm0-4h8v2H9zm0 8h8v2H9zM7 7H5v2h2V7zm0 4H5v2h2v-2zm0 4H5v2h2v-2z"/></svg>',
    quiz:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 18h2v2h-2v-2zm1-16C6.48 2 2 6.48 2 12h2a8 8 0 1 1 8 8v2c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 5h2v6h-2V7z"/></svg>',
  }
  return icons[name] ?? icons.task
}
</script>
