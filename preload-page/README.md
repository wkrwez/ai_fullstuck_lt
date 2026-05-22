# Pre-render Demo - 首屏预渲染对比

基于 Vue 3 + Vite + vue-router 的预渲染演示项目。

## 项目结构

```
preload-page/
  src/
    router/index.js    # 路由配置（3个页面）
    pages/Home.vue     # 首页 - 包含大量耗时内容
    pages/About.vue    # 关于预渲染
    pages/Contact.vue  # 联系我们
  scripts/
    prerender.mjs      # 自定义预渲染脚本（Puppeteer）
  dist-spa/            # 普通 SPA 构建产物
  dist/                # 预渲染后的构建产物
```

## 三种路由页面

| 路由 | 页面 | 说明 |
| ---- | ---- | ---- |
| `/` | 首页 | 包含 500 行数据、50万次复杂计算、1.5s API 模拟延迟 |
| `/about` | 关于 | 介绍预渲染原理的静态内容页 |
| `/contact` | 联系我们 | 轻量信息展示页 |

## 首页的耗时内容

首页模拟真实重度首屏场景，包含以下耗时操作：

1. **模拟 API 延迟**：`setTimeout` 1.5 秒
2. **大量计算**：50 万次 `Math.sqrt + Math.sin` 运算
3. **大数据渲染**：生成 500 行用户数据表格

上述操作导致普通 SPA 模式下首屏有明显的白屏/骨架屏等待时间。

## 运行方式

```bash
npm install
npm run dev              # 开发模式
npm run build            # 完整构建（SPA + 预渲染）
npm run preview:spa       # 预览普通 SPA 版本
npm run preview:prerender # 预览预渲染版本
```

## 预渲染前后对比

| 指标 | 普通 SPA (dist-spa/) | 预渲染 (dist/) |
| ---- | -------------------- | -------------- |
| index.html 大小 | **461 bytes** | **223,851 bytes** |
| 首屏内容 | 空壳 `<div id="app">` | 完整 500 行表格数据 |
| 加载表现 | 白屏 → 骨架屏 → 内容 | 内容直接展示 |
| 用户等待时间 | ~1.5s+ | 0s（HTML 已包含数据） |
| SEO | 不友好（空 HTML） | 友好（完整内容） |

### 对比方式

1. **SPA 版本**：`npm run preview:spa` → 打开浏览器 → 观察白屏和加载过程
2. **预渲染版本**：`npm run preview:prerender` → 打开浏览器 → 内容瞬间呈现

也可直接在浏览器 Network 面板中将网速调整为 Slow 3G 观察差异。

## 预渲染工作原理

```
vite build (SPA) → 得到空壳 HTML
                       ↓
              Puppeteer 无头浏览器
              访问 localhost:8765/
              等待 app-rendered 事件
              捕获完整 DOM HTML
                       ↓
              写入 dist/index.html（含完整数据）
```

当用户访问预渲染后的页面时，浏览器直接展示 HTML 中的内容，无需等待 JavaScript 加载、API 调用和计算过程。
