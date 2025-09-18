// src/types/roles.js
export const ROLES = Object.freeze({
  ADMIN_GENERALE: 'ADMIN_GENERALE',
  ADMIN_ECOLE: 'ADMIN_ECOLE',
  PROFESSEUR: 'PROFESSEUR',
  ELEVE: 'ELEVE',
  PARENT_TUTEUR: 'PARENT_TUTEUR',
})

export const ROLE_LABELS = {
  [ROLES.ADMIN_GENERALE]: 'Admin général',
  [ROLES.ADMIN_ECOLE]: 'Admin école',
  [ROLES.PROFESSEUR]: 'Professeur',
  [ROLES.ELEVE]: 'Élève',
  [ROLES.PARENT_TUTEUR]: 'Parent/Tuteur',
}
