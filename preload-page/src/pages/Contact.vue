<script setup>
</script>

<template>
  <div class="contact-page">
    <h1>联系我们</h1>
    <p class="subtitle">此页面为轻量页面，无需预渲染也能快速加载</p>

    <div class="info-grid">
      <div class="info-item">
        <span class="label">邮箱</span>
        <span class="value">demo@prerender-example.com</span>
      </div>
      <div class="info-item">
        <span class="label">GitHub</span>
        <span class="value">github.com/vite-plugin-prerender</span>
      </div>
      <div class="info-item">
        <span class="label">技术栈</span>
        <span class="value">Vue 3 + Vite + vue-router</span>
      </div>
      <div class="info-item">
        <span class="label">预渲染插件</span>
        <span class="value">vite-plugin-prerender</span>
      </div>
    </div>

    <div class="note">
      <strong>提示：</strong>在首页（/）对比预渲染前后的加载效果。预渲染后 HTML 文件包含完整表格数据，无需等待 JS 执行即可展示。
    </div>
  </div>
</template>

<style scoped>
.contact-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 24px;
  text-align: center;
}

h1 {
  font-size: 2rem;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.subtitle {
  color: #888;
  margin-bottom: 32px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.info-item {
  background: #f8f9fc;
  padding: 16px;
  border-radius: 8px;
  text-align: left;
}

.label {
  display: block;
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 4px;
}

.value {
  color: #333;
  font-weight: 500;
}

.note {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  padding: 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #8c6d00;
  text-align: left;
  line-height: 1.6;
}
</style>
