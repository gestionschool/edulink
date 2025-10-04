import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {router} from './router/index.js'
import App from './App.vue'
import './style.css'

const app =createApp(App)
const pinia =createPinia()

app.use(pinia)

import { useAuthStore } from '@/stores/useAuth'
const auth = useAuthStore()
auth.init() // <— hydrate user/token si présents

console.log('Auth ready?', auth.ready)
console.log('Auth user:', auth.user)
console.log('Auth logged in:', auth.isLoggedIn)

app.use(router)

app.mount('#app')

