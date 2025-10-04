<!-- src/components/pedagogie/InterrosFilters.vue -->
<template>
  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
    <input
      :value="search"
      @input="$emit('update:search', $event.target.value)"
      type="search"
      placeholder="Rechercher (titre, cours, classe, prof)…"
      class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
             focus:border-violet-500 focus:ring-1 focus:ring-violet-500
             dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
    />

    <select
      :value="classeId"
      @change="$emit('update:classeId', $event.target.value)"
      class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
             focus:border-violet-500 focus:ring-1 focus:ring-violet-500
             dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
    >
      <option value="">Toutes classes</option>
      <option v-for="o in classesOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>

    <select
      :value="coursId"
      @change="$emit('update:coursId', $event.target.value)"
      class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
             focus:border-violet-500 focus:ring-1 focus:ring-violet-500
             dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
    >
      <option value="">Tous cours</option>
      <option v-for="o in coursOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>

    <select
      :value="periodeId"
      @change="$emit('update:periodeId', $event.target.value)"
      class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
             focus:border-violet-500 focus:ring-1 focus:ring-violet-500
             dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
    >
      <option value="">Toutes périodes</option>
      <option v-for="o in periodesOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>

    <select
      :value="type"
      @change="$emit('update:type', $event.target.value)"
      class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
             focus:border-violet-500 focus:ring-1 focus:ring-violet-500
             dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
    >
      <option value="">Tous types</option>
      <option v-for="o in typesOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  search: String,
  classeId: String,
  coursId: String,
  periodeId: String,
  type: String,
  classesOptions: { type: Array, default: () => [] },
  coursOptions:   { type: Array, default: () => [] },
  periodesOptions:{ type: Array, default: () => [] },
  typesOptions:   { type: Array, default: () => [] },
})
defineEmits(['update:search','update:classeId','update:coursId','update:periodeId','update:type'])
</script>
