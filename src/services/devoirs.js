import { http, withPage } from './http'

const expand = '_expand=cours'

export function listDevoirs(opts) {
  return http.get(`/devoirs?${expand}`, withPage(opts))
             .then(r => ({ data: r.data, total: Number(r.headers['x-total-count'] || r.data.length) }))
}
export const createDevoir = (p) => http.post('/devoirs', p).then(r => r.data)
export const updateDevoir = (id, p) => http.put(`/devoirs/${id}`, p).then(r => r.data)
export const removeDevoir = (id) => http.delete(`/devoirs/${id}`).then(() => true)
