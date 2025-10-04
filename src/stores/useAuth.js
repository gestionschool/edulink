// src/stores/useAuth.js
import { defineStore } from 'pinia'
import { AuthService } from '@/services/auth'
import { useUsers } from '@/stores/useUsers' // optionnel

const LS_KEY = 'auth_state_v1' // { user, token }

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
    ready: false, // indique que init() a fini (avec ou sans session)
  }),
  getters: {
    isLoggedIn: (s) => !!s.user && !!s.token,
    role: (s) => s.user?.role ?? null,
  },
  actions: {
    async init() {
      this.loading = true
      this.error = null
      try {
        const raw = localStorage.getItem(LS_KEY)   // <-- corrige STORAGE_KEY -> LS_KEY
        if (raw) {
          const parsed = JSON.parse(raw)
          this.user  = parsed.user  ?? null
          this.token = parsed.token ?? null
        }
      } catch (e) {
        // on ignore, mais on logge éventuellement
        console.warn('[auth.init] parse error:', e)
      } finally {
        this.ready = true         // <-- très important
        this.loading = false
      }
    },

    persist() {
      localStorage.setItem(LS_KEY, JSON.stringify({ user: this.user, token: this.token }))
    },

    clear() {
      this.user = null
      this.token = null
      localStorage.removeItem(LS_KEY)
    },

    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        // AuthService.login doit renvoyer { user, token }
        const { user, token } = await AuthService.login(email, password)

        this.user = user
        this.token = token
        this.persist()

        // Optionnel : hydrate/MAJ le cache des users
        const users = useUsers?.()
        if (users?.upsert) users.upsert(user)

        return user
      } catch (e) {
        this.error = e?.message || 'Erreur de connexion'
        throw e
      } finally {
        this.ready = true
        this.loading = false
      }
    },

    logout() {
      this.clear()
    },

    async refreshMe() {
      if (!this.user?.id) return
      const fresh = await AuthService.me(this.user.id)
      if (fresh) {
        this.user = { ...this.user, ...fresh }
        this.persist()
      }
    },
  }
})
