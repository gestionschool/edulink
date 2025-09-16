// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref('')

  async function login({ email, password }) {
    loading.value = true
    error.value = ''
    try {
      // 👉 remplace par ton vrai appel API
      await new Promise(r => setTimeout(r, 700))
      if (!email || !password) throw new Error('Email et mot de passe requis.')
      // succès “mock”
      user.value = { id: 'u_1', email, name: email.split('@')[0] }
      token.value = 'mock-token'
      return true
    } catch (e) {
      error.value = e?.message || 'Échec de connexion.'
      return false
    } finally {
      loading.value = false
    }
  }

  async function loginWithGoogle() {
    loading.value = true
    error.value = ''
    try {
      // 👉 à brancher (OAuth)
      await new Promise(r => setTimeout(r, 600))
      user.value = { id: 'u_g', email: 'you@gmail.com', name: 'You' }
      token.value = 'mock-google-token'
      return true
    } catch (e) {
      error.value = e?.message || 'Échec Google.'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
  }

  const isAuthenticated = () => !!token.value

  return { user, token, loading, error, login, loginWithGoogle, logout, isAuthenticated }
})
