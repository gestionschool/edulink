<!-- src/pages/BulletinDetail.vue -->
<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div class="mx-auto max-w-6xl p-4 sm:p-6">
        <!-- État: introuvable -->
        <div v-if="notFound" class="rounded-xl border p-6 text-sm text-zinc-600 dark:text-zinc-300">
          Bulletin introuvable. Vérifie l’URL (<code>/bulletin/:eleveId/:periodeId</code>).
        </div>

        <!-- Contenu principal -->
        <div v-else class="p-6 max-w-6xl mx-auto">
          <!-- Header / Actions -->
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 class="text-2xl font-semibold">
                Fiche de cote — {{ student?.nom || 'Élève' }}
              </h1>
              <p class="text-sm text-zinc-600 dark:text-zinc-400">
                Période : {{ periode?.label || '—' }} •
                Classe : {{ classe?.label || '—' }}
              </p>
            </div>

            <div class="flex gap-2">
              <button @click="onExportPDF" class="px-3 py-2 rounded-xl border dark:border-zinc-700">
                Exporter PDF
              </button>
              <button @click="onPrint" class="px-3 py-2 rounded-xl border dark:border-zinc-700">
                Imprimer
              </button>
            </div>
          </div>

          <!-- Identité élève -->
          <div class="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 mb-6">
            <img
              :src="student?.photoUrl || placeholderAvatar"
              alt="Photo élève"
              class="w-28 h-28 rounded-xl object-cover bg-zinc-200 dark:bg-zinc-800"
            />
            <div class="rounded-2xl border border-[var(--grid-line-color,#e5e7eb)] dark:border-zinc-800 p-4">
              <div class="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <div class="text-zinc-500 dark:text-zinc-400">Nom complet</div>
                  <div class="font-medium">{{ student?.nom || '—' }}</div>
                </div>
                <div>
                  <div class="text-zinc-500 dark:text-zinc-400">Matricule</div>
                  <div class="font-medium">{{ student?.matricule || '—' }}</div>
                </div>
                <div>
                  <div class="text-zinc-500 dark:text-zinc-400">Classe</div>
                  <div class="font-medium">{{ classe?.label || '—' }}</div>
                </div>
                <div>
                  <div class="text-zinc-500 dark:text-zinc-400">Année scolaire</div>
                  <div class="font-medium">{{ schoolYear }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tableau des matières & évaluations -->
          <div class="rounded-2xl border border-[var(--grid-line-color,#e5e7eb)] dark:border-zinc-800 overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-zinc-50 dark:bg-zinc-900/50">
                <tr class="text-left">
                  <th class="px-4 py-3">Matière</th>
                  <th class="px-4 py-3">Évaluations (D/Int/Exam)</th>
                  <th class="px-4 py-3">Moy. matière</th>
                  <th class="px-4 py-3">Observations</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in rows"
                  :key="row.matiere"
                  class="border-t border-[var(--grid-line-color,#e5e7eb)] dark:border-zinc-800 align-top"
                >
                  <td class="px-4 py-3 font-medium">{{ row.matiere }}</td>
                  <td class="px-4 py-3">
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="(ev, idx) in row.evaluations"
                        :key="`${row.matiere}-${ev.type}-${ev.coef}-${idx}`"
                        class="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-[var(--grid-line-color,#e5e7eb)] dark:border-zinc-800"
                      >
                        <span class="text-xs uppercase tracking-wide">{{ ev.type }}</span>
                        <span class="text-xs">Coef {{ ev.coef }}</span>
                        <span class="text-xs font-semibold">{{ fmtNote(ev.note) }}</span>
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-3 font-semibold">{{ fmtNote(row.moyenne) }}</td>
                  <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">{{ row.observations || '—' }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="border-t border-[var(--grid-line-color,#e5e7eb)] dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40">
                  <td class="px-4 py-3 font-semibold" colspan="2">Moyenne générale</td>
                  <td class="px-4 py-3 font-bold text-lg">{{ fmtNote(moyenneGenerale) }}</td>
                  <td class="px-4 py-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Résumé & mentions -->
          <div class="mt-6 grid sm:grid-cols-3 gap-4">
            <div class="rounded-2xl border border-[var(--grid-line-color,#e5e7eb)] dark:border-zinc-800 p-4">
              <div class="text-zinc-500 dark:text-zinc-400 text-sm">Rang</div>
              <div class="text-2xl font-semibold">{{ rankDisplay }}</div>
            </div>
            <div class="rounded-2xl border border-[var(--grid-line-color,#e5e7eb)] dark:border-zinc-800 p-4">
              <div class="text-zinc-500 dark:text-zinc-400 text-sm">Mention</div>
              <div class="text-2xl font-semibold">{{ mention }}</div>
            </div>
            <div class="rounded-2xl border border-[var(--grid-line-color,#e5e7eb)] dark:border-zinc-800 p-4">
              <div class="text-zinc-500 dark:text-zinc-400 text-sm">Observations générales</div>
              <div class="text-sm">{{ observationsGenerales || '—' }}</div>
            </div>
          </div>

          <!-- Signatures -->
          <div class="mt-10 grid sm:grid-cols-2 gap-6">
            <div>
              <div class="text-sm text-zinc-500 dark:text-zinc-400">Professeur principal</div>
              <div class="h-20 mt-6 rounded-xl border border-dashed border-[var(--grid-line-color,#e5e7eb)] dark:border-zinc-800"></div>
            </div>
            <div>
              <div class="text-sm text-zinc-500 dark:text-zinc-400">Direction</div>
              <div class="h-20 mt-6 rounded-xl border border-dashed border-[var(--grid-line-color,#e5e7eb)] dark:border-zinc-800"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useSchoolStore } from '@/stores/school'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/* ====== Route params ====== */
const route = useRoute()
const eleveId = computed(() => Number(route.params.eleveId))
const periodeId = computed(() => Number(route.params.periodeId))

/* ====== Store ====== */
const school = useSchoolStore()
const bulletin = computed(() => school.getBulletin(eleveId.value, periodeId.value))

/* Dérivées du bulletin */
const student = computed(() => bulletin.value?.eleve || null)
const classe  = computed(() => bulletin.value?.classe || null)
const periode = computed(() => bulletin.value?.periode || null)
const evaluations = computed(() => bulletin.value?.evaluations || [])
const observationsGenerales = computed(() => bulletin.value?.observationsGenerales || '')
const rank = computed(() => bulletin.value?.rank ?? null)
const notFound = computed(() => !student.value || !classe.value || !periode.value)

/* Année scolaire au format YYYY-YYYY */
const schoolYear = new Date().getMonth() + 1 >= 9
  ? `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
  : `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`

/* Avatar placeholder */
const placeholderAvatar =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23e5e7eb"/><circle cx="100" cy="80" r="40" fill="%239ca3af"/><rect x="40" y="130" width="120" height="50" rx="25" fill="%239ca3af"/></svg>'

/* ====== Calculs ====== */
const rows = computed(() => groupByMatiere(evaluations.value))

const moyenneGenerale = computed(() => {
  if (!rows.value.length) return null
  const notes = rows.value.map(r => r.moyenne).filter(n => typeof n === 'number')
  if (!notes.length) return null
  const mean = notes.reduce((a, b) => a + b, 0) / notes.length
  return roundTo(mean, 1)
})
const mention = computed(() => mentionFrom(moyenneGenerale.value))
const rankDisplay = computed(() => (rank.value ? `${rank.value}ᵉ` : '—'))

/* ====== Helpers ====== */
function groupByMatiere (list) {
  const by = {}
  for (const ev of list) {
    if (!by[ev.matiere]) by[ev.matiere] = []
    by[ev.matiere].push(ev)
  }
  return Object.keys(by).map(matiere => {
    const evals = by[matiere]
    const coefSum = evals.reduce((s, e) => s + (e.coef || 0), 0)
    const score = evals.reduce((s, e) => s + (isFinite(e.note) ? (e.note * (e.coef || 0)) : 0), 0)
    const moy = coefSum ? (score / coefSum) : null
    return {
      matiere,
      evaluations: evals,
      moyenne: moy != null ? roundTo(moy, 1) : null,
      observations: evals.map(e => e.obs).filter(Boolean).join(' • ')
    }
  })
}
function roundTo (x, d = 1) {
  if (!isFinite(x)) return null
  const p = Math.pow(10, d)
  return Math.round(x * p) / p
}
function fmtNote (n) {
  return n == null ? '—' : `${Number(n).toFixed(1)}/20`
}
function mentionFrom (m) {
  if (m == null) return '—'
  if (m >= 16) return 'Très bien'
  if (m >= 14) return 'Bien'
  if (m >= 12) return 'Assez bien'
  if (m >= 10) return 'Passable'
  return 'Insuffisant'
}

/* ====== Actions ====== */
function onPrint () {
  window.print()
}
function onExportPDF () {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const margin = 40
  const line = (y) => doc.line(margin, y, doc.internal.pageSize.getWidth() - margin, y)

  // Header
  doc.setFontSize(14)
  doc.text(`FICHE DE COTE — ${student.value?.nom || ''}`, margin, 50)
  doc.setFontSize(10)
  doc.text(
    `Période: ${periode.value?.label || ''} • Classe: ${classe.value?.label || ''} • Année: ${schoolYear}`,
    margin, 68
  )
  line(80)

  // Élève info
  const startY = 100
  doc.setFontSize(10)
  doc.text(`Matricule: ${student.value?.matricule || ''}`, margin, startY)
  doc.text(`Mention: ${mention.value}`, margin, startY + 16)
  doc.text(`Moyenne générale: ${fmtNote(moyenneGenerale.value)}`, margin, startY + 32)
  doc.text(`Rang: ${rankDisplay.value}`, margin, startY + 48)

  // Tableau matières
  const tableBody = rows.value.map(r => [
    r.matiere,
    r.evaluations.map(e => `${e.type} (${e.coef}) : ${fmtNote(e.note)}`).join('\n'),
    fmtNote(r.moyenne),
    r.observations || ''
  ])

  autoTable(doc, {
    startY: startY + 70,
    head: [['Matière', 'Évaluations (D/Int/Exam)', 'Moy. matière', 'Observations']],
    body: tableBody,
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [245, 245, 245], textColor: 0 },
    theme: 'grid',
    margin: { left: margin, right: margin },
  })

  // Observations générales + signatures
  let y = doc.lastAutoTable.finalY + 20
  doc.setFontSize(10)
  const obs = observationsGenerales.value || '—'
  doc.text('Observations générales :', margin, y)
  const wrapped = doc.splitTextToSize(obs, doc.internal.pageSize.getWidth() - margin * 2)
  doc.text(wrapped, margin, y + 16)

  y = y + 16 + wrapped.length * 12 + 24
  line(y)
  y += 16
  doc.text('Professeur principal (signature) :', margin, y)
  doc.text('Direction (signature) :', doc.internal.pageSize.getWidth() / 2 + 10, y)

  doc.save(`Bulletin_${student.value?.nom || 'eleve'}_${periode.value?.label || ''}.pdf`)
}
</script>

<style scoped>
@media print {
  :host, html, body {
    background: #fff !important;
    color: #000 !important;
  }
  img { filter: grayscale(0.2); }
  button { display: none !important; }
}
</style>
