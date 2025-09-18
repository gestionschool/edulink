import { http, withPage } from './http'
export const listTeachers = (opts) => http.get('/teachers', withPage(opts))
  .then(r => ({ data: r.data, total: Number(r.headers['x-total-count'] || r.data.length) }))
export const createTeacher = (p) => http.post('/teachers', p).then(r => r.data)
export const updateTeacher = (id, p) => http.put(`/teachers/${id}`, p).then(r => r.data)
export const removeTeacher = (id) => http.delete(`/teachers/${id}`).then(() => true)
