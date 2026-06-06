import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// 生产环境 HTML 模板（用于 qiankun 加载）
const prodHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>React 子应用</title>
  <link rel="stylesheet" href="./style.css" />
  <script src="./react-app.umd.js"></script>
</head>
<body>
  <div id="root"></div>
  <script>
    (function () {
      var appName = 'react-app'

      if (window.__POWERED_BY_QIANKUN__) {
        // qiankun 环境：UMD 全局 reactApp 已由上方 script 标签注入
        window[appName] = {
          bootstrap: function () { return window.reactApp.bootstrap() },
          mount: function (props) { return window.reactApp.mount(props) },
          unmount: function () { return window.reactApp.unmount() },
          update: function (props) {
            return window.reactApp.update ? window.reactApp.update(props) : Promise.resolve()
          },
        }
      } else {
        // 独立运行：UMD 加载完成后自动挂载
        window.reactApp.mount({})
      }
    })()
  </script>
</body>
</html>`

export default defineConfig({
  plugins: [
    react(),
    // 自定义插件：lib 模式下 Vite 不会生成 HTML，这里手动写入 dist/
    {
      name: 'generate-qiankun-html',
      closeBundle() {
        if (!fs.existsSync('dist')) fs.mkdirSync('dist', { recursive: true })
        fs.writeFileSync(path.resolve('dist', 'index.html'), prodHtml)
        console.log('  ✓ 已生成 qiankun 入口 HTML')
      },
    },
  ],

  // 生产构建：UMD 库模式，qiankun 通过 HTML 入口加载
  build: {
    lib: {
      entry: './src/main.jsx',
      name: 'reactApp',           // window.reactApp 即生命周期导出
      formats: ['umd'],
      fileName: () => 'react-app.umd.js',
    },
    outDir: 'dist',
    emptyOutDir: true,
  },

  server: {
    port: 8002,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
})
