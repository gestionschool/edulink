import { defineStore } from 'pinia'
import { listStudents, createStudent, updateStudent, removeStudent } from '@/services/students'

export const useStudentsStore = defineStore('students', {
  state: () => ({
    items: [],
    total: 0,
    page: 1,
    limit: 20,
    q: '',
    sort: '',
    order: 'asc',
    loading: false,
    error: null
  }),
  actions: {
    async fetch() {
      this.loading = true; this.error = null
      try {
        const { data, total } = await listStudents({
          page: this.page, limit: this.limit, q: this.q, sort: this.sort, order: this.order
        })
        // “view” dénormalisée comme dans ton store initial
        this.items = data.map(e => ({
          ...e,
          classeLabel: e.classe?.libelle || e.classe?.label || ''
        }))
        this.total = total
      } catch (e) {
        this.error = e?.message || String(e)
      } finally { this.loading = false }
    },
    async create(payload) { await createStudent(payload); await this.fetch() },
    async update(id, patch) { await updateStudent(id, patch); await this.fetch() },
    async remove(id) { await removeStudent(id); await this.fetch() }
  },
  getters: {
    uniqueClasses() {
      return Array.from(new Set(this.items.map(i => i.classeLabel).filter(Boolean))).sort()
    }
  }
})
