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
auth.initFromStorage() // <— hydrate user/token si présents

app.use(router).mount('#app')

