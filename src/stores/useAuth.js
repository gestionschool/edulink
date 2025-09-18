import { defineStore } from 'pinia'
import { usersService } from '@/services/resources'
import { ROLES, ROLE_LABELS } from '@/types/roles'

const STORAGE_KEY = 'edulink.auth.v1'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,      // { id, name, email, role }
    loading: false,
    error: null,
  }),
  getters: {
    role: (s) => s.user?.role || null,
    roleLabel: (s) => ROLE_LABELS[s.user?.role] || '',
    isLoggedIn: (s) => !!s.user,
  },
  actions: {
    // ---------- Persistance ----------
    initFromStorage() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const u = JSON.parse(raw)
          // 🔒 Assure un rôle valide
          if (!u.role) u.role = ROLES.ADMIN_GENERALE
          this.user = u
        }
      } catch { /* ignore */ }
    },
    saveToStorage() {
      try {
        this.user
          ? localStorage.setItem(STORAGE_KEY, JSON.stringify(this.user))
          : localStorage.removeItem(STORAGE_KEY)
      }  catch { /* ignore */ }
    },

    // ---------- API / Session ----------
    setUser(u){ 
      this.user = u
      this.saveToStorage()
    },
    async login(email, _password){
      this.loading = true; this.error = null
      try {
        const found = await usersService.list({ email })
        let user = found?.[0]
        if (!user) {
          // Bootstrapping MVP: créer un super admin à la volée
          user = await usersService.create({
            name: 'Super Admin', email, role: ROLES.ADMIN_GENERALE
          })
        }
        // 🛡️ Patch si l’utilisateur existant n’a pas de rôle
        if (!user.role) {
          user = await usersService.update(user.id, { role: ROLES.ADMIN_GENERALE })
        }

        this.user = user
        this.saveToStorage()
        return user
      } catch (e) {
        this.error = e.message || String(e)
        throw e
      } finally { this.loading = false }
    },
    logout(){
      this.user = null
      this.saveToStorage()
    },
    switchRole(role){
      if (this.user) {
        this.user = { ...this.user, role }
        this.saveToStorage()
      }
    },
  },
})
