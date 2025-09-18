import { http } from './http'

// Factory CRUD standard pour json-server
export function createResource(resource) {
  const base = `/${resource}`;
  return {
    list:   (params={})       => http.get(base, params),
    get:    (id)              => http.get(`${base}/${id}`),
    create: (payload)         => http.post(base, payload),
    update: (id, payload)     => http.patch(`${base}/${id}`, payload),
    replace:(id, payload)     => http.put(`${base}/${id}`, payload),
    remove: (id)              => http.del(`${base}/${id}`),
  };
}

// Déclare ici tous les endpoints de ton dev:api
export const ecolesService        = createResource('ecoles')
export const usersService         = createResource('users')
export const studentsService      = createResource('students')
export const classesService       = createResource('classes')
export const periodesService      = createResource('periodes')
export const teachersService      = createResource('teachers')
export const coursService         = createResource('cours')
export const evaluationsService   = createResource('evaluations')
export const bulletinsMetaService = createResource('bulletinsMeta')
export const interrosService      = createResource('interros')
export const examensService       = createResource('examens')
export const devoirsService       = createResource('devoirs')
