<!-- src/components/pedagogie/NotesFilters.vue -->
<template>
  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
    <!-- Classe -->
    <select
      :value="classeId"
      @change="$emit('update:classeId', $event.target.value)"
      class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
             focus:border-violet-500 focus:ring-1 focus:ring-violet-500
             dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
    >
      <option value="">Choisir une classe…</option>
      <option v-for="o in classesOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>

    <!-- Cours (filtré par classe + rôle prof) -->
    <select
      :value="coursId"
      @change="$emit('update:coursId', $event.target.value)"
      :disabled="!classeId"
      class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
             disabled:opacity-60
             focus:border-violet-500 focus:ring-1 focus:ring-violet-500
             dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
    >
      <option value="">Cours…</option>
      <option v-for="o in coursOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>

    <!-- Période -->
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

    <!-- Type -->
    <select
      :value="type"
      @change="$emit('update:type', $event.target.value)"
      class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
             focus:border-violet-500 focus:ring-1 focus:ring-violet-500
             dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
    >
      <option value="">Type…</option>
      <option v-for="o in typesOptions" :key="o" :value="o">{{ o }}</option>
    </select>

    <!-- Coef -->
    <input
      :value="coef"
      @input="$emit('update:coef', $event.target.value)"
      type="number" min="1" step="1"
      placeholder="Coef"
      class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
             focus:border-violet-500 focus:ring-1 focus:ring-violet-500
             dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
    />
  </div>
</template>

<script setup>
defineProps({
  classeId: String,
  coursId: String,
  periodeId: String,
  type: String,
  coef: [String, Number],
  classesOptions: { type: Array, default: () => [] },
  coursOptions: { type: Array, default: () => [] },
  periodesOptions: { type: Array, default: () => [] },
  typesOptions: { type: Array, default: () => ['Devoir', 'Interro', 'Examen'] },
})
defineEmits(['update:classeId','update:coursId','update:periodeId','update:type','update:coef'])
</script>
