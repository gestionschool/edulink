// src/services/crud.js
import { http } from './http'

export const makeCrudService = (resource) => ({
  list:   (params = {})        => http.get(`/${resource}`, params),
  get:    (id)                 => http.get(`/${resource}/${id}`),
  create: (payload)            => http.post(`/${resource}`, payload),
  update: (id, payload)        => http.patch(`/${resource}/${id}`, payload),
  remove: (id)                 => http.del(`/${resource}/${id}`),
})
