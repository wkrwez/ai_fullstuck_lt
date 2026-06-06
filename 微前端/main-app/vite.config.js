import { defineConfig } from 'vite'

export default defineConfig({
  // 生产构建：作为主应用壳子，基础路径为 /
  base: '/',
  build: {
    outDir: 'dist',
    // 确保共享模块也被打包进来（shared 目录在 main-app 外部）
    rollupOptions: {
      output: {
        // 主应用入口保持不变，方便阅读
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
  server: {
    port: 8000,
    // 允许访问项目根目录的 shared/ 模块（开发模式）
    fs: {
      allow: ['..'],
    },
  },
})
