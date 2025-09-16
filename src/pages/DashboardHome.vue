<!-- pages/DashboardHome.vue -->
<template>
  <div>
    <PageHeader title="Tableau de bord" />
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <Kpi label="Étudiants" :value="1280"/>
      <Kpi label="Professeurs" :value="86"/>
      <Kpi label="Cours actifs" :value="142"/>
      <Kpi label="Examens à venir" :value="12"/>
    </div>
    <div class="mt-6">
      <h2 class="font-semibold mb-2 text-gray-900 dark:text-gray-100">Prochains examens</h2>
      <!-- mini-table -->
      <DataTable :rows="rows" :headers="headers" idKey="id" @edit="() => {}" @remove="() => {}"/>
    </div>
  </div>
</template>
<script setup>
import PageHeader from '@/components/PageHeader.vue'
import DataTable from '@/components/DataTable.vue'

const headers=[{key:'intitule',label:'Examen'},{key:'classe',label:'Classe'},{key:'date',label:'Date'}]
const rows=[{id:1,intitule:'Math S1',classe:'6ème A',date:'2025-10-02'}]
</script>
<script>
export default { components:{ Kpi:{
  props:['label','value'],
  template:`<div class="p-4 rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-700"><div class="text-sm text-gray-500 dark:text-gray-400">{{label}}</div><div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{value}}</div></div>`
}}}
</script>
