import { http, withPage } from './http'

export function listPeriodes(opts) {
  return http.get('/periodes', withPage(opts))
             .then(r => ({ data: r.data, total: Number(r.headers['x-total-count'] || r.data.length) }))
}
export const getPeriode = (id) => http.get(`/periodes/${id}`).then(r => r.data)
