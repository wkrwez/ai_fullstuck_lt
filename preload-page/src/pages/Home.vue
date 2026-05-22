<script setup>
import { ref, onMounted, computed } from 'vue'

function generateLargeDataset(count = 500) {
  const data = []
  for (let i = 0; i < count; i++) {
    data.push({
      id: i + 1,
      name: `User_${String(i + 1).padStart(4, '0')}`,
      email: `user${i + 1}@example.com`,
      role: i % 3 === 0 ? 'Admin' : i % 3 === 1 ? 'Editor' : 'Viewer',
      status: i % 4 === 0 ? 'Inactive' : 'Active',
      lastLogin: new Date(Date.now() - Math.random() * 365 * 24 * 3600 * 1000).toLocaleDateString(),
      score: Math.floor(Math.random() * 10000),
      department: ['Engineering', 'Marketing', 'Sales', 'Support', 'Finance'][i % 5],
    })
  }
  return data
}

function heavyComputation() {
  let result = 0
  for (let i = 0; i < 500000; i++) {
    result += Math.sqrt(i) * Math.sin(i)
  }
  return result
}

// Init state based on whether DOM was already prerendered at build time.
// Must happen at setup time, not onMounted — otherwise Vue hydration
// sees a mismatch and replaces prerendered content with skeleton screens.
const wasPrerendered = typeof document !== 'undefined' && document.querySelector('.stat-card') !== null

console.log(
  wasPrerendered
    ? '%c[PRERENDER DETECTED] %cContent already in DOM, skipping heavy work'
    : '%c[SPA MODE] %cWill run full loading + computation',
  'color:green;font-size:14px;', 'color:default;'
)

const loading = ref(!wasPrerendered)
const items = ref(wasPrerendered ? generateLargeDataset(500) : [])
const loadTime = ref(0)

const prerenderDetected = computed(() => {
  return wasPrerendered || window.__PRERENDER_INJECTED || navigator.webdriver
})

onMounted(async () => {
  if (wasPrerendered) return

  const start = performance.now()

  await new Promise(resolve => setTimeout(resolve, 1500))
  heavyComputation()
  items.value = generateLargeDataset(500)
  loading.value = false
  loadTime.value = Math.round(performance.now() - start)

  document.dispatchEvent(new Event('app-rendered'))
})
</script>

<template>
  <div class="home-page">
    <div class="hero">
      <h1>首屏性能演示页面</h1>
      <p>此页面包含大量数据和耗时操作，模拟真实场景中的重度首屏加载</p>

      <div class="status-badge" :class="loading ? 'pending' : 'done'">
        <template v-if="loading">
          <span class="spinner"></span>
          正在加载数据...（耗时 API 调用 + 50万次复杂计算 + 500条数据渲染）
        </template>
        <template v-else>
          <template v-if="wasPrerendered">
            &#9889; 预渲染版本 — 内容直接从 HTML 展示，无需等待（0ms）
          </template>
          <template v-else>
            &#128064; SPA 客户端渲染 — 耗时 {{ loadTime }}ms（含 1.5s API + 50万次计算）
          </template>
        </template>
      </div>

      <div class="prerender-indicator" :class="{ active: !loading || prerenderDetected }">
        <template v-if="prerenderDetected || !loading">
          <strong v-if="prerenderDetected">&#9889; 预渲染生效</strong>
          <strong v-else>&#128064; 客户端渲染</strong>
        </template>
        <span>
          预渲染后 HTML 中已包含完整内容，浏览器直接展示，无需等待 JS 执行。
          对比非预渲染：用户需等待白屏 → JS 加载 → API 调用 → 计算 → 渲染。
        </span>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="skeleton" v-for="n in 8" :key="n">
        <div class="skeleton-line" :style="{ width: (60 + Math.random() * 40) + '%' }"></div>
      </div>
    </div>

    <div v-else class="content">
      <div class="stats">
        <div class="stat-card">
          <span class="stat-value">{{ items.length }}</span>
          <span class="stat-label">总用户数</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ items.filter(i => i.status === 'Active').length }}</span>
          <span class="stat-label">活跃用户</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ items.filter(i => i.role === 'Admin').length }}</span>
          <span class="stat-label">管理员</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ loadTime }}ms</span>
          <span class="stat-label">页面加载耗时</span>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>用户名</th>
              <th>邮箱</th>
              <th>角色</th>
              <th>部门</th>
              <th>状态</th>
              <th>最后登录</th>
              <th>积分</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id" :class="{ inactive: item.status === 'Inactive' }">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.email }}</td>
              <td><span class="role-tag" :class="item.role.toLowerCase()">{{ item.role }}</span></td>
              <td>{{ item.department }}</td>
              <td><span class="status-dot" :class="item.status.toLowerCase()"></span> {{ item.status }}</td>
              <td>{{ item.lastLogin }}</td>
              <td>{{ item.score.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  margin-bottom: 32px;
}

.hero h1 {
  font-size: 2rem;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.hero p {
  color: #666;
  font-size: 1rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  margin-top: 16px;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffc107;
}

.status-badge.done {
  background: #d4edda;
  color: #155724;
  border: 1px solid #28a745;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #856404;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.prerender-indicator {
  margin-top: 16px;
  padding: 16px;
  background: #f0f4ff;
  border: 1px solid #b8c9ff;
  border-radius: 8px;
  text-align: left;
  font-size: 0.9rem;
  color: #333;
  line-height: 1.6;
}

.prerender-indicator.active {
  background: #d4edda;
  border-color: #28a745;
}

.prerender-indicator strong {
  display: block;
  margin-bottom: 4px;
  font-size: 1rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton {
  padding: 16px;
  background: #f0f0f0;
  border-radius: 8px;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
}

.stat-label {
  font-size: 0.85rem;
  color: #888;
  margin-top: 4px;
}

.table-container {
  overflow-x: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

thead {
  background: #1a1a2e;
  color: #fff;
}

th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  white-space: nowrap;
}

td {
  padding: 10px 16px;
  border-bottom: 1px solid #eee;
}

tbody tr:hover {
  background: #f5f7ff;
}

tr.inactive {
  opacity: 0.5;
}

.role-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.role-tag.admin { background: #ffe0e0; color: #c00; }
.role-tag.editor { background: #e0f0ff; color: #06c; }
.role-tag.viewer { background: #e8e8e8; color: #555; }

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.status-dot.active { background: #28a745; }
.status-dot.inactive { background: #dc3545; }
</style>
