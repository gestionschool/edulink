// src/stores/useAuth.js
import { defineStore } from 'pinia'

export const ROLES = {
  ADMIN_GENERALE: 'admin_generale',
  ADMIN_ECOLE: 'admin_ecole',
  PROFESSEUR: 'professeur',
  ELEVE: 'eleve',
}

export const ROLE_LABELS = {
  [ROLES.ADMIN_GENERALE]: 'Admin générale',
  [ROLES.ADMIN_ECOLE]: 'Admin école (Direction)',
  [ROLES.PROFESSEUR]: 'Professeur',
  [ROLES.ELEVE]: 'Élève',
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Démo: change au login avec setUser(...)
    user: { id: 1, name: 'Admin', role: ROLES.ADMIN_GENERALE },
  }),
  getters: {
    role: (s) => s.user?.role || null,
    roleLabel: (s) => ROLE_LABELS[s.user?.role] || '',
    isLoggedIn: (s) => !!s.user,
  },
  actions: {
    setUser(user) { this.user = user },
    logout() { this.user = null },
  },
})
