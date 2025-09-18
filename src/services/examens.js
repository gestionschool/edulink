import { http, withPage } from './http'

const expand = '_expand=cours'

export function listExamens(opts) {
  return http.get(`/examens?${expand}`, withPage(opts))
             .then(r => ({ data: r.data, total: Number(r.headers['x-total-count'] || r.data.length) }))
}
export const createExamen = (p) => http.post('/examens', p).then(r => r.data)
export const updateExamen = (id, p) => http.put(`/examens/${id}`, p).then(r => r.data)
export const removeExamen = (id) => http.delete(`/examens/${id}`).then(() => true)
