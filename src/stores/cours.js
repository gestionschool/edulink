import { defineStore } from 'pinia'
import { listCours, createCours, updateCours, removeCours } from '@/services/cours'

export const useCoursStore = defineStore('cours', {
  state: () => ({
    items: [],
    total: 0,
    page: 1,
    limit: 20,
    q: '',
    sort: 'code',
    order: 'asc',
    loading: false,
    error: null,
  }),
  actions: {
    async fetch() {
      this.loading = true; this.error = null
      try {
        const { data, total } = await listCours({
          page: this.page, limit: this.limit, q: this.q, sort: this.sort, order: this.order
        })
        this.items = data.map(c => ({
          ...c,
          classeLabel: c.classe?.libelle || c.classe?.label || '',
          professeur:  c.teacher?.nom || [c.teacher?.prenom, c.teacher?.nom].filter(Boolean).join(' '),
          periode:     c.periode?.label || '',
        }))
        this.total = total
      } catch (e) {
        this.error = e?.message || String(e)
      } finally { this.loading = false }
    },
    async create(p) { await createCours(p); await this.fetch() },
    async update(id, patch) { await updateCours(id, patch); await this.fetch() },
    async remove(id) { await removeCours(id); await this.fetch() }
  },
  getters: {
    uniqueMatieres: (s) => Array.from(new Set(s.items.map(i => i.matiere).filter(Boolean))).sort(),
    uniqueClasses:  (s) => Array.from(new Set(s.items.map(i => i.classeLabel).filter(Boolean))).sort(),
    uniquePeriodes: (s) => Array.from(new Set(s.items.map(i => i.periode).filter(Boolean))).sort(),
    uniqueProfs:    (s) => Array.from(new Set(s.items.map(i => i.professeur).filter(Boolean))).sort(),
  }
})
