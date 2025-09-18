import { http, withPage } from './http'

export function listClasses(opts) {
  return http.get('/classes', withPage(opts))
             .then(r => ({ data: r.data, total: Number(r.headers['x-total-count'] || r.data.length) }))
}
export const getClasse = (id) => http.get(`/classes/${id}`).then(r => r.data)
