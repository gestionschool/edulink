import { defineStore } from 'pinia'
import { listEvaluations, createEvaluation, updateEvaluation, removeEvaluation } from '@/services/evaluations'
import { http } from '@/services/http' // pour récupérer élève/classe/période

export const useEvaluationsStore = defineStore('evaluations', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
    eleve: null,
    classe: null,
    periode: null,
  }),
  actions: {
    async fetch({ eleveId, periodeId }) {
      this.loading = true; this.error = null
      try {
        // données de contexte (affichage bulletin)
        const [eleve, evs] = await Promise.all([
          http.get(`/students/${eleveId}`, { params: { _expand: 'classe' } }).then(r => r.data),
          listEvaluations({ eleveId, periodeId })
        ])
        this.eleve = eleve
        this.classe = eleve?.classe ?? null
        this.periode = await http.get(`/periodes/${periodeId}`).then(r => r.data)

        // vue dénormalisée
        this.items = evs.map(e => ({
          ...e,
          coef: Number(e.coef ?? 1),
          note: Number(e.note ?? 0),
          matiereLabel: e.matiere,
          typeLabel: e.type,
        }))
      } catch (e) { this.error = e?.message || String(e) }
      finally { this.loading = false }
    },
    async upsert(payload) {
      if (payload.id) await updateEvaluation(payload.id, payload)
      else await createEvaluation(payload)
      await this.fetch({ eleveId: payload.eleveId, periodeId: payload.periodeId })
    },
    async remove(id, ctx) {
      await removeEvaluation(id)
      await this.fetch(ctx) // { eleveId, periodeId }
    }
  },
  getters: {
    moyenne() {
      const sumCoef = this.items.reduce((s, r) => s + (r.coef || 1), 0) || 1
      const pond = this.items.reduce((s, r) => s + (r.note || 0) * (r.coef || 1), 0)
      return +(pond / sumCoef).toFixed(2)
    }
  }
})
