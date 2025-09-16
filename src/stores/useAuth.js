// src/stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Démo: remplace au login via setUser({ id, name, role })
    user: { id: 1, name: 'Admin', role: 'admin' } // 'admin' | 'professeur' | 'gestion'
  }),
  actions: {
    setUser(user) { this.user = user }
    // setUser(null) pour déconnexion
  }
})
