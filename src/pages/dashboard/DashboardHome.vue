<template>
  <section class="space-y-6">
    <header>
      <h1 class="text-2xl font-semibold">Tableau de bord</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400">Vue d’ensemble de l’établissement</p>
    </header>

    <!-- KPIs -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border p-4 bg-white dark:bg-slate-900 dark:border-slate-800">
        <div class="text-sm text-slate-500">Élèves</div>
        <div class="mt-1 text-2xl font-semibold">{{ kpis.students }}</div>
      </div>
      <div class="rounded-xl border p-4 bg-white dark:bg-slate-900 dark:border-slate-800">
        <div class="text-sm text-slate-500">Classes</div>
        <div class="mt-1 text-2xl font-semibold">{{ kpis.classes }}</div>
      </div>
      <div class="rounded-xl border p-4 bg-white dark:bg-slate-900 dark:border-slate-800">
        <div class="text-sm text-slate-500">Professeurs</div>
        <div class="mt-1 text-2xl font-semibold">{{ kpis.teachers }}</div>
      </div>
      <div class="rounded-xl border p-4 bg-white dark:bg-slate-900 dark:border-slate-800">
        <div class="text-sm text-slate-500">Cours</div>
        <div class="mt-1 text-2xl font-semibold">{{ kpis.cours }}</div>
      </div>
    </div>

    <!-- Moyenne période active -->
    <div class="rounded-xl border p-4 bg-white dark:bg-slate-900 dark:border-slate-800">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm text-slate-500">Moyenne globale</div>
          <div class="mt-1 text-2xl font-semibold">
            {{ moyenneGlobale ?? '—' }}
            <span v-if="periodeActive" class="text-sm font-normal text-slate-500 ml-2">
              ({{ periodeActive.label }})
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- À venir -->
    <div class="grid gap-4 md:grid-cols-2">
      <div class="rounded-xl border p-4 bg-white dark:bg-slate-900 dark:border-slate-800">
        <h3 class="font-semibold mb-2">Devoirs à venir</h3>
        <ul class="space-y-2">
          <li v-for="d in prochainsDevoirs" :key="d.id" class="flex items-center justify-between text-sm">
            <span class="truncate">{{ d.titre }}</span>
            <span class="text-slate-500">{{ d.dateRemise }}</span>
          </li>
          <li v-if="!prochainsDevoirs.length" class="text-sm text-slate-500">Aucun devoir à venir.</li>
        </ul>
      </div>

      <div class="rounded-xl border p-4 bg-white dark:bg-slate-900 dark:border-slate-800">
        <h3 class="font-semibold mb-2">Examens programmés</h3>
        <ul class="space-y-2">
          <li v-for="e in prochainsExamens" :key="e.id" class="flex items-center justify-between text-sm">
            <span class="truncate">{{ e.titre }}</span>
            <span class="text-slate-500">{{ e.date }}</span>
          </li>
          <li v-if="!prochainsExamens.length" class="text-sm text-slate-500">Aucun examen à venir.</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useSchoolStore } from '@/stores/school'

const school = useSchoolStore()

const kpis = computed(() => ({
  students: school.students.length,
  classes: school.classes.length,
  teachers: school.teachers.length,
  cours: school.cours.length,
}))

const periodeActive = computed(() => school.periodes.find(p => p.active))
const moyenneGlobale = computed(() => {
  if (!periodeActive.value) return null
  const rows = school.evaluations.filter(e => e.periodeId === periodeActive.value.id)
  if (!rows.length) return null
  const totalCoef = rows.reduce((s, r) => s + Number(r.coef || 0), 0)
  if (!totalCoef) return null
  const total = rows.reduce((s, r) => s + Number(r.note || 0) * Number(r.coef || 0), 0)
  return (total / totalCoef).toFixed(2)
})

const today = new Date().toISOString().slice(0, 10)
const prochainsDevoirs = computed(() =>
  [...school.devoirsView]
    .filter(d => d.dateRemise >= today)
    .sort((a, b) => a.dateRemise.localeCompare(b.dateRemise))
    .slice(0, 5)
)
const prochainsExamens = computed(() =>
  [...school.examensView]
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5)
)
</script>
