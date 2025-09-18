import { defineStore } from 'pinia'
import { listTeachers, createTeacher, updateTeacher, removeTeacher } from '@/services/teachers'

export const useTeachersStore = defineStore('teachers', {
  state: () => ({ items: [], total: 0, page: 1, limit: 20, q: '', loading: false, error: null }),
  actions: {
    async fetch() {
      this.loading = true; this.error = null
      try {
        const { data, total } = await listTeachers({ page: this.page, limit: this.limit, q: this.q })
        this.items = data; this.total = total
      } catch (e) { this.error = e?.message || String(e) }
      finally { this.loading = false }
    },
    async create(p){ await createTeacher(p); await this.fetch() },
    async update(id, patch){ await updateTeacher(id, patch); await this.fetch() },
    async remove(id){ await removeTeacher(id); await this.fetch() }
  }
})
