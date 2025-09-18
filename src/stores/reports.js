import { defineStore } from 'pinia'
import { http } from '@/services/http'

export const useReportsStore = defineStore('reports', {
  state: () => ({
    loading: false,
    error: null,
    cards: { eleves: 0, classes: 0, cours: 0, profs: 0 },
    byClasse: [],      // [{ classe: "6ème A", eleves: 42 }]
    moyennesParClasse: [], // [{ classe: "6ème A", moyenne: 12.4 }]
  }),
  actions: {
    async refresh({ ecoleId } = {}) {
      this.loading = true; this.error = null
      try {
        const params = ecoleId ? { ecoleId } : undefined
        const [students, classes, cours, teachers] = await Promise.all([
          http.get('/students', { params }).then(r => r.data),
          http.get('/classes',  { params }).then(r => r.data),
          http.get('/cours',    { params }).then(r => r.data),
          http.get('/teachers', { params }).then(r => r.data),
        ])
        this.cards = { eleves: students.length, classes: classes.length, cours: cours.length, profs: teachers.length }

        // répartition élèves par classe
        const byId = Object.fromEntries(classes.map(c => [c.id, c]))
        const map = new Map()
        students.forEach(s => {
          const label = byId[s.classeId]?.libelle || byId[s.classeId]?.label || '—'
          map.set(label, (map.get(label) || 0) + 1)
        })
        this.byClasse = Array.from(map, ([classe, eleves]) => ({ classe, eleves }))

        // moyenne par classe (toutes périodes confondues pour MVP)
        const evals = await http.get('/evaluations', { params }).then(r => r.data)
        const coursById = Object.fromEntries(cours.map(c => [c.id, c]))
        const agg = new Map() // classeLabel -> { sum, coef }
        evals.forEach(e => {
          const c = coursById[e.coursId]; if (!c) return
          const label = byId[c.classeId]?.libelle || byId[c.classeId]?.label || '—'
          const coef = Number(e.coef || 1), note = Number(e.note || 0)
          const cur = agg.get(label) || { sum: 0, coef: 0 }
          agg.set(label, { sum: cur.sum + note * coef, coef: cur.coef + coef })
        })
        this.moyennesParClasse = Array.from(agg, ([classe, v]) => ({
          classe, moyenne: v.coef ? +(v.sum / v.coef).toFixed(2) : 0
        }))
      } catch (e) { this.error = e?.message || String(e) }
      finally { this.loading = false }
    }
  }
})
