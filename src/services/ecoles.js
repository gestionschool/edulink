// src/services/ecoles.js
import { edulinkApi } from './http' // <- ton axios préconfiguré (baseURL: http://localhost:4000)

export const EcolesService = {
  async list(params = {}) {
    const { data } = await edulinkApi.get('/ecoles', { params })
    return data
  },
  async get(id) {
    const { data } = await edulinkApi.get(`/ecoles/${id}`)
    return data
  },
  async create(payload) {
    const { data } = await edulinkApi.post('/ecoles', payload)
    return data
  },
  async update(id, payload) {
    const { data } = await edulinkApi.patch(`/ecoles/${id}`, payload)
    return data
  },
  async remove(id) {
    await edulinkApi.delete(`/ecoles/${id}`)
    return true
  },
}
