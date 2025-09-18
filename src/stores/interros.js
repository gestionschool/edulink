import { defineStore } from 'pinia'
import { listInterros, createInterro, updateInterro, removeInterro } from '@/services/interros'
import { listClasses } from '@/services/classes'
import { listPeriodes } from '@/services/periodes'

export const useInterrosStore = defineStore('interros', {
  state: () => ({
    items: [],
    total: 0,
    page: 1,
    limit: 20,
    q: '',
    sort: 'date',
    order: 'desc',
    loading: false,
    error: null,
    classesMap: {},   // id -> classe
    periodesMap: {},  // id -> période
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
        const { data, total } = await listInterros({
          page: this.page, limit: this.limit, q: this.q, sort: this.sort, order: this.order
        })
        this.items = data.map(r => {
          const cours = r.cours
          const classe = cours?.classeId ? this.classesMap[cours.classeId] : null
          const periode = cours?.periodeId ? this.periodesMap[cours.periodeId] : null
          return {
            ...r,
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
    async create(p) { await createInterro(p); await this.fetch() },
    async update(id, patch) { await updateInterro(id, patch); await this.fetch() },
    async remove(id) { await removeInterro(id); await this.fetch() }
  },
  getters: {
    uniqueCours:   (s) => Array.from(new Set(s.items.map(i => i.coursLabel).filter(Boolean))).sort(),
    uniqueClasses: (s) => Array.from(new Set(s.items.map(i => i.classeLabel).filter(Boolean))).sort(),
    uniqueTypes:   (s) => Array.from(new Set(s.items.map(i => i.type).filter(Boolean))).sort(),
  }
})
