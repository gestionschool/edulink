// src/stores/ecoles.js
import { defineStore } from 'pinia'
import { EcolesService } from '@/services/ecoles'

export const useEcolesStore = defineStore('ecoles', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
    lastFetchedAt: null,
  }),
  getters: {
    byId: (s) => (id) => s.items.find(e => String(e.id) === String(id)) || null,
    total: (s) => s.items.length,
    // tri basique par nom si présent
    sorted: (s) =>
      [...s.items].sort((a, b) => (a.nom || '').localeCompare(b.nom || '')),
  },
  actions: {
    async fetchAll(force = false) {
      if (this.loading) return
      if (!force && this.items.length) return // évite double fetch simple
      this.loading = true
      this.error = null
      try {
        const data = await EcolesService.list()
        // Normalisation très légère pour éviter undefined dans l’UI
        this.items = (Array.isArray(data) ? data : []).map(r => ({
          id: r.id,
          nom: r.nom ?? r.name ?? '—',
          code: r.code ?? '—',
          ville: r.ville ?? r.city ?? '—',
          directeur: r.directeur ?? r.director ?? '—',
          telephone: r.telephone ?? r.phone ?? '',
          email: r.email ?? '',
          ...r,
        }))
        this.lastFetchedAt = Date.now()
      } catch (e) {
        this.error = e
      } finally {
        this.loading = false
      }
    },
    async create(row) {
      const created = await EcolesService.create(row)
      this.items.unshift(created)
      return created
    },
    async update(id, patch) {
      const updated = await EcolesService.update(id, patch)
      const i = this.items.findIndex(e => e.id === id)
      if (i >= 0) this.items[i] = { ...this.items[i], ...updated }
      return updated
    },
    async remove(id) {
      await EcolesService.remove(id)
      this.items = this.items.filter(e => e.id !== id)
    },
  },
})
