// src/stores/_crudFactory.js
import { defineStore } from 'pinia'

export function makeCrudStore(storeKey, service) {
  return defineStore(storeKey, {
    state: () => ({
      items: [],
      byId: {},
      loading: false,
      error: null,
      // json-server: tu peux passer _page/_limit, mais on n’a pas X-Total-Count via http.js
      meta: { page: 1, limit: 20, total: null },
    }),
    getters: {
      rows: (s) => s.items,
      get:  (s) => (id) => s.byId[id] ?? s.items.find(r => r.id === Number(id)) ?? null,
      isEmpty: (s) => !s.loading && s.items.length === 0,
    },
    actions: {
      _upsert(row) {
        if (!row?.id && row?.id !== 0) return
        const i = this.items.findIndex(r => r.id === row.id)
        if (i >= 0) this.items[i] = row
        else this.items.push(row)
        this.byId[row.id] = row
      },
      _removeLocal(id) {
        this.items = this.items.filter(r => r.id !== id)
        delete this.byId[id]
      },

      async fetch(params = {}) {
        this.loading = true; this.error = null
        try {
          const data = await service.list(params)
          this.items = Array.isArray(data) ? data : []
          this.byId = Object.fromEntries(this.items.map(r => [r.id, r]))
          return this.items
        } catch (e) {
          this.error = e; console.error(`[${storeKey}] fetch error:`, e)
          throw e
        } finally {
          this.loading = false
        }
      },
      
      async list(params = {}) {
        return this.fetch(params)
      },

      async getOne(id, { force = false } = {}) {
        if (!force && this.byId[id]) return this.byId[id]
        const row = await service.get(id)
        this._upsert(row)
        return row
      },

      async createOne(payload) {
        const created = await service.create(payload)
        this._upsert(created)
        return created
      },

      async updateOne(id, payload) {
        const updated = await service.update(id, payload)
        this._upsert(updated)
        return updated
      },

      async removeOne(id) {
        await service.remove(id)
        this._removeLocal(id)
      },
    },
  })
}
