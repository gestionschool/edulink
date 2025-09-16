<!-- src/pages/DashboardHome.vue -->
<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div class="mx-auto max-w-6xl grid gap-4 p-4 sm:p-6">
        <PageHeader title="Tableau de bord" />

        <!-- KPIs -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Étudiants"       :value="nbStudents" />
          <StatCard label="Professeurs"     :value="nbTeachers" />
          <StatCard label="Cours actifs"    :value="nbActiveCourses" />
          <StatCard label="Examens à venir" :value="nbUpcomingExams" />
        </div>

        <!-- Prochains examens -->
        <div class="rounded-xl border border-gray-200 bg-white p-3 shadow-sm
                    dark:border-gray-700 dark:bg-gray-900 gap-4">
          <h2 class="font-semibold mb-2 text-gray-900 dark:text-gray-100">Prochains examens</h2>

          <DataTable
            :rows="upcomingExamRows"
            :headers="headers"
            idKey="id"
            @edit="() => {}"
            @remove="() => {}"
          />
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useSchoolStore } from '@/stores/school'
import PageHeader from '@/components/PageHeader.vue'
import DataTable from '@/components/DataTable.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import StatCard from '@/components/ui/StatCard.vue'

const school = useSchoolStore()

/* ====== Headers pour la mini-table ====== */
// on utilise 'titre' (clé existante dans examens du store)
const headers = [
  { key: 'titre',  label: 'Examen' },
  { key: 'classe', label: 'Classe' },
  { key: 'date',   label: 'Date' }
]

/* ====== KPIs dynamiques ====== */
const todayStr = new Date().toISOString().slice(0, 10)
const activePeriodIds = computed(() => {
  const ids = school.periodes.filter(p => p.active).map(p => p.id)
  return ids.length ? ids : school.periodes.map(p => p.id) // fallback si aucune période marquée active
})

const nbStudents = computed(() => school.students.length)
const nbTeachers = computed(() => school.teachers.length)
const nbActiveCourses = computed(() =>
  school.cours.filter(c => activePeriodIds.value.includes(c.periodeId)).length
)
const nbUpcomingExams = computed(() =>
  school.examens.filter(e => e.date >= todayStr).length
)

/* ====== Mini-table: prochains examens (via la vue “examensView”) ====== */
const upcomingExamRows = computed(() => 
  // examensView fournit { id, titre, date, cours, classe, ... }
school.examensView
    .filter(e => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6)
    .map(e => ({
      id: e.id,
      titre: e.titre,
      classe: e.classe,
      date: toFR(e.date)            // joli format
    }))
)

console.log(upcomingExamRows.value);


function toFR(iso){ if(!iso) return ''; const [y,m,d]=iso.split('-'); return `${d}/${m}/${y}` }
</script>
