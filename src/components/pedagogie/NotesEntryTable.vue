<!-- src/components/pedagogie/NotesEntryTable.vue -->
<template>
  <!-- Cards mobile -->
  <div class="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
    <div v-for="s in students" :key="s.id" class="p-4">
      <div class="font-medium">{{ s.nom }}</div>
      <div class="mt-2 flex items-center gap-3">
        <label class="text-xs opacity-70">Note / {{ bareme }}</label>
        <input
          type="number" min="0" :max="bareme" step="0.5"
          :value="modelValue[s.id] ?? ''"
          @input="onInput(s.id, $event.target.value)"
          class="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm
                 focus:border-violet-500 focus:ring-1 focus:ring-violet-500
                 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
      <p v-if="extras[s.id]" class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ extras[s.id] }}</p>
    </div>
  </div>

  <!-- Table desktop -->
  <div class="hidden md:block overflow-x-auto">
    <table class="min-w-full text-left text-sm">
      <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <tr>
          <th class="px-4 py-3 font-medium">Élève</th>
          <th class="px-4 py-3 font-medium w-36">Note / {{ bareme }}</th>
          <th class="px-4 py-3 font-medium">Info</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="s in students"
          :key="s.id"
          class="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
        >
          <td class="px-4 py-3">{{ s.nom }}</td>
          <td class="px-4 py-3">
            <input
              type="number" min="0" :max="bareme" step="0.5"
              :value="modelValue[s.id] ?? ''"
              @input="onInput(s.id, $event.target.value)"
              class="w-28 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm
                     focus:border-violet-500 focus:ring-1 focus:ring-violet-500
                     dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </td>
          <td class="px-4 py-3 text-slate-500 dark:text-slate-400">
            {{ extras[s.id] || '—' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Footer actions -->
  <div class="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm dark:border-slate-800">
    <span class="text-slate-500 dark:text-slate-400">
      {{ students.length }} élèves
    </span>
    <button
      class="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 disabled:opacity-60 dark:border-violet-900"
      :disabled="saving"
      @click="$emit('save')"
    >
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5 12l4 4L19 6l-2-2-8 8-2-2-2 2z"/></svg>
      {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  students: { type: Array, default: () => [] },
  bareme:   { type: Number, default: 20 },
  modelValue: { type: Object, default: () => ({}) }, // { [eleveId]: noteNumber }
  extras: { type: Object, default: () => ({}) },     // ex: libellé classe, etc (optionnel)
  saving: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue','save'])

function onInput(id, val) {
  const n = val === '' ? '' : Number(val)
  const next = { ...props.modelValue, [id]: n }
  emit('update:modelValue', next)
}
</script>
