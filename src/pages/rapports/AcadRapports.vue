<template>
  <section class="space-y-4">
    <header>
      <h1 class="text-xl font-semibold">Rapports académiques</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400">Moyennes par classe et matière</p>
    </header>

    <div class="grid gap-4 md:grid-cols-2">
      <!-- Moyenne par classe -->
      <div class="rounded-xl border p-4 bg-white dark:bg-slate-900 dark:border-slate-800">
        <h3 class="font-semibold mb-2">Moyenne par classe ({{ periode?.label || '—' }})</h3>
        <ul class="space-y-1 text-sm">
          <li v-for="r in moyennesClasse" :key="r.id" class="flex items-center justify-between">
            <span>{{ r.classe }}</span>
            <span class="font-semibold">{{ r.moy?.toFixed(2) ?? '—' }}</span>
          </li>
          <li v-if="!moyennesClasse.length" class="text-slate-500">—</li>
        </ul>
      </div>

      <!-- Moyenne par matière -->
      <div class="rounded-xl border p-4 bg-white dark:bg-slate-900 dark:border-slate-800">
        <h3 class="font-semibold mb-2">Moyenne par matière ({{ periode?.label || '—' }})</h3>
        <ul class="space-y-1 text-sm">
          <li v-for="r in moyennesMatiere" :key="r.matiere" class="flex items-center justify-between">
            <span>{{ r.matiere }}</span>
            <span class="font-semibold">{{ r.moy?.toFixed(2) ?? '—' }}</span>
          </li>
          <li v-if="!moyennesMatiere.length" class="text-slate-500">—</li>
        </ul>
      </div>
    </div>

    <div class="flex gap-2 items-center">
      <label class="text-sm text-slate-500">Période:</label>
      <select v-model.number="periodeId" class="px-3 py-2 rounded border dark:bg-slate-900">
        <option v-for="p in school.periodes" :key="p.id" :value="p.id">{{ p.label }}</option>
      </select>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useSchoolStore } from '@/stores/school'
const school = useSchoolStore()
const periodeId = ref(school.periodes.find(p => p.active)?.id ?? school.periodes[0]?.id ?? 0)
const periode = computed(() => school.getPeriode(periodeId.value))

function moy(rows){
  const tc = rows.reduce((s, r) => s + Number(r.coef||0), 0)
  if(!tc) return null
  const t = rows.reduce((s, r) => s + Number(r.note||0)*Number(r.coef||0), 0)
  return t / tc
}

const moyennesClasse = computed(() => {
  return school.classes.map(c => {
    const eleves = school.students.filter(e => e.classeId === c.id).map(e => e.id)
    const evals = school.evaluations.filter(e => eleves.includes(e.eleveId) && e.periodeId === periodeId.value)
    return { id: c.id, classe: c.libelle || c.label || c.code, moy: moy(evals) }
  })
})

const moyennesMatiere = computed(() => {
  const groups = new Map()
  school.evaluations
    .filter(e => e.periodeId === periodeId.value)
    .forEach(e => {
      if(!groups.has(e.matiere)) groups.set(e.matiere, [])
      groups.get(e.matiere).push(e)
    })
  return Array.from(groups.entries()).map(([matiere, rows]) => ({ matiere, moy: moy(rows) }))
})
</script>
