<!-- components/DataTable.vue -->
<template>
  <div
    class="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm
           dark:border-gray-700 dark:bg-gray-900"
  >
    <table class="min-w-full text-sm">
      <!-- En-tête -->
      <thead class="bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
        <tr>
          <th
            v-for="h in headers"
            :key="h.key"
            scope="col"
            class="px-3 py-2 text-left font-medium"
          >
            {{ h.label }}
          </th>
          <th scope="col" class="px-3 py-2 text-right font-medium">Actions</th>
        </tr>
      </thead>

      <!-- Corps -->
      <tbody>
        <tr
          v-for="row in rows"
          :key="row[idKey]"
          class="border-t border-gray-200 hover:bg-gray-50
                 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <td
            v-for="h in headers"
            :key="h.key"
            class="px-3 py-2 text-gray-900 dark:text-gray-100"
          >
            {{ row[h.key] }}
          </td>

          <!-- Actions -->
          <td class="px-3 py-2 text-right">
            <button
              type="button"
              @click="emit('edit', row)"
              class="mr-2 inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium
                     text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500
                     dark:text-blue-400 dark:focus:ring-blue-400"
            >
              Modifier
            </button>
            <button
              type="button"
              @click="emit('remove', row)"
              class="inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium
                     text-red-700 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500
                     dark:text-red-400 dark:focus:ring-red-400"
            >
              Supprimer
            </button>
          </td>
        </tr>

        <!-- État vide -->
        <tr v-if="rows.length === 0">
          <td
            :colspan="headers.length + 1"
            class="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
          >
            Aucune donnée
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  rows: { type: Array, default: () => [] },
  headers: { type: Array, default: () => [] },
  idKey: { type: String, default: 'id' },
})

const emit = defineEmits(['edit', 'remove'])
</script>
