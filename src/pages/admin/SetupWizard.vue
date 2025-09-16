<!-- src/pages/SetupWizard.vue -->
<template>
    <AppLayout>
        <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">

            <div class="mx-auto max-w-3xl p-4 sm:p-6">
                <PageHeader title="Configuration de l'école" />
                <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Suivez les étapes pour finaliser la structure de l’école.
                </p>
                <ol class="space-y-2">
                    <li v-for="s in steps" :key="s.to" class="flex items-center justify-between rounded-lg border px-3 py-2
                                                        border-gray-200 dark:border-gray-700">
                    <div>
                        <div class="font-medium">{{ s.label }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ s.desc }}</div>
                    </div>
                    <RouterLink :to="s.to" class="btn-outline">Ouvrir</RouterLink>
                    </li>
                </ol>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import PageHeader from '@/components/PageHeader.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
const steps = [
  { label:'Années / Périodes', desc:'Définir trimestres ou semestres', to:'/admin/periodes' },
  { label:'Semestres',         desc:'(si applicable à votre système)', to:'/admin/semestres' },
  { label:'Classes',           desc:'Niveaux, filières, effectifs',    to:'/classes' },
  { label:'Cours',             desc:'Matières par classe, volume',     to:'/cours' },
  { label:'Professeurs',       desc:'Créer / importer les enseignants',to:'/professeurs' },
  { label:'Étudiants',         desc:'Créer / importer les élèves',     to:'/etudiants' },
]
</script>
