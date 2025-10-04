<!-- src/components/pedagogie/BulletinFilters.vue -->
<template>
  <div class="grid gap-3 sm:grid-cols-2">
    <select
      :value="classeId"
      @change="$emit('update:classeId', $event.target.value)"
      class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
             focus:border-violet-500 focus:ring-1 focus:ring-violet-500
             dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
    >
      <option value="">Classe…</option>
      <option v-for="o in classesOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>

    <select
      :value="periodeId"
      @change="$emit('update:periodeId', $event.target.value)"
      class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
             focus:border-violet-500 focus:ring-1 focus:ring-violet-500
             dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
    >
      <option value="">Période…</option>
      <option v-for="o in periodesOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  classeId: String,
  periodeId: String,
  classesOptions: { type: Array, default: () => [] },
  periodesOptions: { type: Array, default: () => [] },
})
defineEmits(['update:classeId','update:periodeId'])
</script>
