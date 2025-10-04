<!-- src/components/pedagogie/CoursFilters.vue -->
<template>
  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    <input
      :value="search"
      @input="$emit('update:search', $event.target.value)"
      type="search"
      placeholder="Rechercher (code, intitulé, prof, classe)…"
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
      :value="profId"
      @change="$emit('update:profId', $event.target.value)"
      class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
             focus:border-violet-500 focus:ring-1 focus:ring-violet-500
             dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
    >
      <option value="">Tous professeurs</option>
      <option v-for="o in profsOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
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
  </div>
</template>

<script setup>
defineProps({
  search: String,
  classeId: String,
  profId: String,
  periodeId: String,
  classesOptions: { type: Array, default: () => [] },
  profsOptions:   { type: Array, default: () => [] },
  periodesOptions:{ type: Array, default: () => [] },
})
defineEmits(['update:search', 'update:classeId', 'update:profId', 'update:periodeId'])
</script>
