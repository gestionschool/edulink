import { http, withPage } from './http'

// Liste + jointure classe via _expand
export function listStudents(opts) {
  return http.get('/students', { ...withPage(opts), params: { ...withPage(opts).params, _expand: 'classe' } })
             .then(r => ({ data: r.data, total: Number(r.headers['x-total-count'] || r.data.length) }))
}
export const getStudent    = (id) => http.get(`/students/${id}`, { params: { _expand: 'classe' } }).then(r => r.data)
export const createStudent = (payload) => http.post('/students', payload).then(r => r.data)
export const updateStudent = (id, payload) => http.put(`/students/${id}`, payload).then(r => r.data)
export const removeStudent = (id) => http.delete(`/students/${id}`).then(r => true)
export const listClasses  = (opts) => http.get('/classes', withPage(opts)).then(r => ({ data: r.data, total: Number(r.headers['x-total-count'] || r.data.length) }))