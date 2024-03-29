import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {  //修改项目默认启动端口
    port: 8080
  },
  //项目别名
  resolve: {
    alias: {
      '@': __dirname + '/src'  
    }
  }
})
