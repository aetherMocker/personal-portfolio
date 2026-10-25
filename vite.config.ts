import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8001,
    host: true,       // listen on 0.0.0.0, reachable from your phone
  },
  preview: {
    port: 8001,
    host: true,       // npm run preview also gets a Network URL
  },
})