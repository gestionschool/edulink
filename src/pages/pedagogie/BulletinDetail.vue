<template>
  <div class="space-y-4">
    <h1 class="text-xl font-semibold">Bulletin</h1>

    <!-- Sélection rapide -->
    <form class="flex flex-wrap gap-2 items-end" @submit.prevent="load">
      <label class="text-sm">Élève ID
        <input v-model.number="eleveId" type="number" class="block px-3 py-2 rounded border" />
      </label>
      <label class="text-sm">Période ID
        <input v-model.number="periodeId" type="number" class="block px-3 py-2 rounded border" />
      </label>
      <button class="px-3 py-2 rounded bg-indigo-600 text-white text-sm">Charger</button>
    </form>

    <div v-if="store.loading">Chargement…</div>
    <div v-else>
      <div class="rounded-xl border p-4">
        <div class="text-sm text-slate-500">
          {{ store.classe?.libelle }} — {{ store.periode?.label }}
        </div>
        <div class="text-lg font-semibold">{{ store.eleve?.nom }}</div>
      </div>

      <div class="rounded-xl border overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th class="p-2 text-left">Matière</th>
              <th class="p-2 text-left">Type</th>
              <th class="p-2 text-left">Coef</th>
              <th class="p-2 text-left">Note</th>
              <th class="p-2 text-left">Observation</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in store.items" :key="e.id" class="border-t">
              <td class="p-2">{{ e.matiere }}</td>
              <td class="p-2">{{ e.type }}</td>
              <td class="p-2">{{ e.coef }}</td>
              <td class="p-2">{{ e.note }}</td>
              <td class="p-2">{{ e.obs }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="rounded-xl border p-4">
        <div class="text-sm text-slate-500">Moyenne</div>
        <div class="text-2xl font-bold">{{ store.moyenne }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useEvaluationsStore } from '@/stores/evaluations'
import { useRoute, useRouter } from 'vue-router'

const store = useEvaluationsStore()
const route = useRoute(); const router = useRouter()
const eleveId = ref(Number(route.query.eleveId) || 1)
const periodeId = ref(Number(route.query.periodeId) || 101)

async function load() {
  await store.fetch({ eleveId: eleveId.value, periodeId: periodeId.value })
  router.replace({ query: { eleveId: eleveId.value, periodeId: periodeId.value } })
}
onMounted(load)
</script>
