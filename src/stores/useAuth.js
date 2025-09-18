// src/stores/useAuth.ts (ou .js si tu es en JS)
import { defineStore } from 'pinia'
import { usersService } from '@/services/resources'
import { ROLES, ROLE_LABELS } from '@/types/roles'

const STORAGE_KEY = 'edulink.auth.v1'

// ---- helpers env / hébergement ----
function isGithubPages() {
  return /github\.io$/i.test(window.location.host)
}
function apiBaseConfigured() {
  // Si tu exposes VITE_API_URL en production
  return !!import.meta.env.VITE_API_URL
}
function shouldUseRemoteAPI() {
  // En local/dev → oui (via proxy Vite)
  // En GH Pages → seulement si VITE_API_URL https est défini
  if (!isGithubPages()) return true
  return apiBaseConfigured()
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),
  getters: {
    role: (s) => s.user?.role ?? null,
    roleLabel: (s) => s.user?.role ? (ROLE_LABELS[s.user.role] ?? s.user.role) : '',
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
        if (this.user) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.user))
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      } catch { /* ignore */ }
    },

    // ---------- API / Session ----------
    setUser(u){ 
      this.user = u
      this.saveToStorage()
    },

    async login(email, password){
      this.loading = true
      this.error = null
      try {
        // 1) Tentative API distante (si autorisé)
        if (shouldUseRemoteAPI()) {
          const found = await usersService.list({ email })
          let user = found?.[0]

          if (!user) {
            // Bootstrapping MVP: créer un super admin à la volée
            user = await usersService.create({
              name: 'Super Admin', email, role: ROLES.ADMIN_GENERALE, password
            })
          }

          // 🛡️ Patch si l’utilisateur existant n’a pas de rôle
          if (!user.role) {
            user = await usersService.update(user.id, { role: ROLES.ADMIN_GENERALE })
          }

          // (Optionnel) Vérifier le mot de passe côté mock si tu le stockes
          if (user.password && user.password !== password) {
            throw new Error('Identifiants invalides')
          }

          this.setUser({
            id: user.id,
            name: user.name ?? 'Utilisateur',
            email: user.email,
            role: user.role ?? ROLES.ADMIN_GENERALE,
          })
          return this.user
        }

        // 2) Fallback GitHub Pages (JSON statique)
        const res = await fetch('/data/users.json', { cache: 'no-store' })
        if (!res.ok) throw new Error('Impossible de lire /data/users.json')
        const users = await res.json()
        const user = users.find((u) => u.email === email && u.password === password)
        if (!user) throw new Error('Identifiants invalides (fallback)')

        this.setUser({
          id: user.id ?? 1,
          name: user.name ?? 'Utilisateur',
          email: user.email,
          role: user.role ?? ROLES.ADMIN_GENERALE,
        })
        return this.user

      } catch (e) {
        // Si on est en dev et que l’API a “connection refused”, on tente aussi le fallback
        const networkFail = e?.name === 'TypeError' || /Failed to fetch|NetworkError|ERR_CONNECTION/i.test(String(e))
        if (!shouldUseRemoteAPI() || networkFail) {
          try {
            const res = await fetch('/data/users.json', { cache: 'no-store' })
            const users = await res.json()
            const user = users.find((u) => u.email === email && u.password === password)
            if (!user) throw new Error('Identifiants invalides (fallback)')
            this.setUser({
              id: user.id ?? 1,
              name: user.name ?? 'Utilisateur',
              email: user.email,
              role: user.role ?? ROLES.ADMIN_GENERALE,
            })
            return this.user
          } catch (e2) {
            this.error = e2?.message ?? 'Erreur de connexion'
            throw e2
          }
        }

        this.error = e?.message ?? 'Erreur de connexion'
        throw e
      } finally {
        this.loading = false
      }
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
