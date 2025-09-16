import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  base: '/edulink/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  
})
