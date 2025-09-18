import { http } from './http'

// list by filtre (eleveId, periodeId, matiere, type…)
export const listEvaluations = (params = {}) =>
  http.get('/evaluations', { params }).then(r => r.data)

export const createEvaluation = (p) => http.post('/evaluations', p).then(r => r.data)
export const updateEvaluation = (id, p) => http.put(`/evaluations/${id}`, p).then(r => r.data)
export const removeEvaluation = (id) => http.delete(`/evaluations/${id}`).then(() => true)
