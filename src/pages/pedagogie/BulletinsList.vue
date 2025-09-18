<template>
  <section class="space-y-4">
    <header class="flex items-end gap-2 flex-wrap">
      <div>
        <h1 class="text-xl font-semibold">Bulletins</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Moyennes par élève et période</p>
      </div>
      <select v-model.number="classeId" class="px-3 py-2 rounded border dark:bg-slate-900">
        <option :value="0" disabled>— Classe —</option>
        <option v-for="c in school.classesView" :key="c.id" :value="c.id">{{ c.libelle }}</option>
      </select>
      <select v-model.number="periodeId" class="px-3 py-2 rounded border dark:bg-slate-900">
        <option v-for="p in school.periodes" :key="p.id" :value="p.id">{{ p.label }}</option>
      </select>
    </header>

    <div v-if="classeId" class="overflow-x-auto rounded-xl border dark:border-slate-800">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-50 dark:bg-slate-900/50">
          <tr class="text-left">
            <th class="p-3">Élève</th><th class="p-3">Moyenne</th><th class="p-3">Rang</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableau" :key="row.eleve.id" class="border-t dark:border-slate-800">
            <td class="p-3">{{ row.eleve.nom }}</td>
            <td class="p-3">{{ row.moyenne?.toFixed(2) ?? '—' }}</td>
            <td class="p-3">{{ row.rank ?? '—' }}</td>
          </tr>
          <tr v-if="!tableau.length"><td colspan="3" class="p-4 text-center text-slate-500">Aucun élève</td></tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSchoolStore } from '@/stores/school'
const school = useSchoolStore()
const classeId = ref(0)
const periodeId = ref(school.periodes.find(p => p.active)?.id ?? school.periodes[0]?.id ?? 0)

const elevesClasse = computed(() => school.students.filter(s => s.classeId === classeId.value))

function moyenneEleve(eleveId, periodeId) {
  const rows = school.getEvaluations(eleveId, periodeId)
  const totalCoef = rows.reduce((s, r) => s + Number(r.coef || 0), 0)
  if (!totalCoef) return null
  const total = rows.reduce((s, r) => s + Number(r.note || 0) * Number(r.coef || 0), 0)
  return total / totalCoef
}

const tableau = computed(() => {
  const rows = elevesClasse.value.map(e => {
    const moy = moyenneEleve(e.id, periodeId.value)
    const meta = school.getBulletinMeta(e.id, periodeId.value)
    return { eleve: e, moyenne: moy, rank: meta.rank || null }
  })
  // si pas de rang, on peut en déduire vite fait
  const sorted = [...rows].filter(r => r.moyenne != null).sort((a,b) => b.moyenne - a.moyenne)
  sorted.forEach((r, i) => { if (!r.rank) r.rank = i + 1 })
  return rows
})
</script>
