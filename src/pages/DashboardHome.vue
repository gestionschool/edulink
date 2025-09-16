<!-- pages/DashboardHome.vue -->
<template>
    <AppLayout>
        <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <div class="mx-auto max-w-6xl grid gap-4 p-4 sm:p-6">    
                <PageHeader title="Tableau de bord" />
                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Étudiants"        :value="1280" />
                    <StatCard label="Professeurs"      :value="86" />
                    <StatCard label="Cours actifs"     :value="142" />
                    <StatCard label="Examens à venir"  :value="12" />
                </div>
                <div class="rounded-xl border border-gray-200 bg-white p-3 shadow-sm
                    dark:border-gray-700 dark:bg-gray-900 gap-4"
                >
                    <h2 class="font-semibold mb-2 text-gray-900 dark:text-gray-100">Prochains examens</h2>
                    <!-- mini-table -->
                    <DataTable :rows="rows" :headers="headers" idKey="id" @edit="() => {}" @remove="() => {}"/>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
<script setup>
import PageHeader from '@/components/PageHeader.vue'
import DataTable from '@/components/DataTable.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import StatCard from '@/components/ui/StatCard.vue'

const headers=[
    {
        key:'intitule',
        label:'Examen'
    },
    {
        key:'classe',
        label:'Classe'
    },
    {
        key:'date',
        label:'Date'
    }
]
const rows=[
    {
        id: 1,
        intitule: 'Math S1',
        classe: '6ème A',
        date: '2025-10-02'
    },
    {
        id: 2,
        intitule: 'Physique S1',
        classe: '6ème B',
        date: '2025-10-05'
    },
    {
        id: 3,
        intitule: 'Français S1',
        classe: '5ème A',
        date: '2025-10-08'
    },
    {
        id: 4,
        intitule: 'Histoire S1',
        classe: '5ème B',
        date: '2025-10-10'
    },
    {
        id: 5,
        intitule: 'SVT S1',
        classe: '4ème A',
        date: '2025-10-12'
    },
]
</script>
<script>
export default { components:{ Kpi:{
  props:['label','value'],
  template:`<div class="p-4 rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-700"><div class="text-sm text-gray-500 dark:text-gray-400">{{label}}</div><div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{value}}</div></div>`
}}}
</script>
