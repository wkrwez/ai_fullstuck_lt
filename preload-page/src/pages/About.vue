<script setup>
</script>

<template>
  <div class="about-page">
    <h1>关于预渲染（Pre-rendering）</h1>

    <section class="info-card">
      <h2>什么是预渲染？</h2>
      <p>
        预渲染是在构建时将 SPA 的关键页面提前渲染为静态 HTML 文件的技术。
        浏览器加载页面时直接展示预先生成的 HTML，无需等待 JavaScript 执行完成，大幅提升首屏加载速度。
      </p>
    </section>

    <section class="info-card">
      <h2>工作原理</h2>
      <ol>
        <li><strong>构建阶段</strong>：使用无头浏览器（如 Puppeteer）访问每个需要预渲染的路由</li>
        <li><strong>等待渲染完成</strong>：等待页面异步数据加载和 DOM 渲染完成</li>
        <li><strong>输出静态 HTML</strong>：将渲染后的完整 HTML 保存为静态文件</li>
        <li><strong>部署</strong>：用户访问时直接获得包含完整内容的 HTML</li>
      </ol>
    </section>

    <section class="info-card">
      <h2>预渲染 vs SSR vs CSR</h2>
      <div class="comparison">
        <div class="compare-col">
          <h3>预渲染</h3>
          <ul>
            <li>构建时生成 HTML</li>
            <li>适合内容不常变的页面</li>
            <li>部署简单，无需 Node 服务器</li>
            <li>首屏极快</li>
          </ul>
        </div>
        <div class="compare-col">
          <h3>SSR</h3>
          <ul>
            <li>请求时动态生成 HTML</li>
            <li>适合个性化内容</li>
            <li>需要 Node.js 服务器</li>
            <li>首屏较快</li>
          </ul>
        </div>
        <div class="compare-col">
          <h3>CSR</h3>
          <ul>
            <li>浏览器中渲染</li>
            <li>首屏白屏时间长</li>
            <li>适合后台管理系统</li>
            <li>SEO 不友好</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

h1 {
  font-size: 2rem;
  color: #1a1a2e;
  text-align: center;
  margin-bottom: 32px;
}

.info-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
}

.info-card h2 {
  font-size: 1.3rem;
  color: #1a1a2e;
  margin-bottom: 12px;
}

.info-card p, .info-card li {
  color: #555;
  line-height: 1.8;
}

.info-card ol {
  padding-left: 20px;
}

.comparison {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 12px;
}

.compare-col {
  background: #f8f9fc;
  padding: 16px;
  border-radius: 6px;
}

.compare-col h3 {
  font-size: 1rem;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
}

.compare-col ul {
  padding-left: 18px;
  font-size: 0.9rem;
  color: #666;
}

.compare-col li {
  margin-bottom: 4px;
}

@media (max-width: 640px) {
  .comparison {
    grid-template-columns: 1fr;
  }
}
</style>
