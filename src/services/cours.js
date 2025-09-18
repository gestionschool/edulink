import { http, withPage } from './http'

// Forcer les _expand en query string (compat JSON Server)
const expand = '_expand=classe&_expand=teacher&_expand=periode'

export function listCours(opts) {
  return http.get(`/cours?${expand}`, withPage(opts))
             .then(r => ({ data: r.data, total: Number(r.headers['x-total-count'] || r.data.length) }))
}
export const getCours    = (id) => http.get(`/cours/${id}?${expand}`).then(r => r.data)
export const createCours = (p)  => http.post('/cours', p).then(r => r.data)
export const updateCours = (id, p) => http.put(`/cours/${id}`, p).then(r => r.data)
export const removeCours = (id) => http.delete(`/cours/${id}`).then(() => true)
