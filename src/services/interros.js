import { http, withPage } from './http'

// interro → _expand=cours (classe/période via coursId)
const expand = '_expand=cours'

export function listInterros(opts) {
  return http.get(`/interros?${expand}`, withPage(opts))
             .then(r => ({ data: r.data, total: Number(r.headers['x-total-count'] || r.data.length) }))
}
export const createInterro = (p) => http.post('/interros', p).then(r => r.data)
export const updateInterro = (id, p) => http.put(`/interros/${id}`, p).then(r => r.data)
export const removeInterro = (id) => http.delete(`/interros/${id}`).then(() => true)
