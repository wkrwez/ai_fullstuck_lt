<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div id="app-shell">
    <nav class="navbar">
      <div class="nav-inner">
        <span class="logo">Pre-render Demo</span>
        <div class="nav-links">
          <router-link to="/">首页（重量级）</router-link>
          <router-link to="/about">关于预渲染</router-link>
          <router-link to="/contact">联系我们</router-link>
        </div>
      </div>
    </nav>

    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
#app-shell {
  min-height: 100vh;
  background: #f5f5f5;
}

.navbar {
  background: #1a1a2e;
  color: #fff;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 56px;
  gap: 32px;
}

.logo {
  font-weight: 700;
  font-size: 1.1rem;
  white-space: nowrap;
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-links a {
  color: #aaa;
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: color 0.2s, background 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

main {
  padding: 24px 0;
}
</style>
