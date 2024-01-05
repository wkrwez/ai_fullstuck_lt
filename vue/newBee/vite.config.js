import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080
  },
  resolve: {
    alias: {
      '@': __dirname + '/src'
    }
  }
})
