import { defineStore } from 'pinia'
import { listDevoirs, createDevoir, updateDevoir, removeDevoir } from '@/services/devoirs'
import { listClasses } from '@/services/classes'
import { listPeriodes } from '@/services/periodes'

export const useDevoirsStore = defineStore('devoirs', {
  state: () => ({
    items: [],
    total: 0,
    page: 1,
    limit: 20,
    q: '',
    sort: 'dateRemise',
    order: 'desc',
    loading: false,
    error: null,
    classesMap: {},
    periodesMap: {},
  }),
  actions: {
    async ensureRefs() {
      if (!Object.keys(this.classesMap).length) {
        const { data } = await listClasses({ limit: 1000 })
        this.classesMap = Object.fromEntries(data.map(c => [c.id, c]))
      }
      if (!Object.keys(this.periodesMap).length) {
        const { data } = await listPeriodes({ limit: 1000 })
        this.periodesMap = Object.fromEntries(data.map(p => [p.id, p]))
      }
    },
    async fetch() {
      this.loading = true; this.error = null
      try {
        await this.ensureRefs()
        const { data, total } = await listDevoirs({
          page: this.page, limit: this.limit, q: this.q, sort: this.sort, order: this.order
        })
        this.items = data.map(d => {
          const cours = d.cours
          const classe = cours?.classeId ? this.classesMap[cours.classeId] : null
          const periode = (d.periodeId && this.periodesMap[d.periodeId]) ||
                          (cours?.periodeId && this.periodesMap[cours.periodeId]) || null
          return {
            ...d,
            coursLabel:   cours?.matiere || cours?.intitule || '',
            classeLabel:  classe?.libelle || classe?.label || '',
            periodeLabel: periode?.label || '',
          }
        })
        this.total = total
      } catch (e) {
        this.error = e?.message || String(e)
      } finally { this.loading = false }
    },
    async create(p) { await createDevoir(p); await this.fetch() },
    async update(id, patch) { await updateDevoir(id, patch); await this.fetch() },
    async remove(id) { await removeDevoir(id); await this.fetch() }
  },
  getters: {
    uniqueCours:    (s) => Array.from(new Set(s.items.map(i => i.coursLabel).filter(Boolean))).sort(),
    uniqueClasses:  (s) => Array.from(new Set(s.items.map(i => i.classeLabel).filter(Boolean))).sort(),
    uniquePeriodes: (s) => Array.from(new Set(s.items.map(i => i.periodeLabel).filter(Boolean))).sort(),
    uniqueStatuts:  (s) => Array.from(new Set(s.items.map(i => i.statut).filter(Boolean))).sort(),
  }
})
