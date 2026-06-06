<template>
  <div class="vue3-app">
    <div class="app-header">
      <span class="badge">Vue 3</span>
      <span class="badge-info">独立子应用</span>
    </div>

    <h2>任务管理面板</h2>
    <p class="desc">
      此页面由 <strong>Vue3 Composition API</strong> 驱动，独立开发、独立部署
    </p>

    <!-- ===== 通信演示区域 ===== -->
    <div class="com-section">
      <h4>双向通信演示（子应用端）</h4>

      <!-- 方法①：qiankun GlobalState -->
      <div class="com-row">
        <span class="com-label">① GlobalState:</span>
        <span>user = <strong>{{ mainProps?.user || '—' }}</strong></span>
        <input v-model="gsNewUser" placeholder="新用户名" size="12" />
        <button @click="updateGlobalState">回传给主应用</button>
      </div>

      <!-- 方法②：EventBus -->
      <div class="com-row">
        <span class="com-label">② EventBus:</span>
        <input v-model="eventMsg" placeholder="消息内容" size="14" />
        <button @click="emitToMain">发送给主应用</button>
        <span class="com-recv" v-if="lastEventMsg">收到: {{ lastEventMsg }}</span>
      </div>

      <!-- 方法③：Props Callback -->
      <div class="com-row">
        <span class="com-label">③ Props回调:</span>
        <button @click="callPropsCallback">调用主应用回调</button>
        <span class="note">（主应用日志区可见）</span>
      </div>

      <!-- 方法④：共享 Store -->
      <div class="com-row">
        <span class="com-label">④ Store:</span>
        <span>theme = <strong>{{ storeTheme }}</strong></span>
        <button @click="toggleTheme">切换主题</button>
        <span class="note">（主应用+所有子应用同步）</span>
      </div>

      <!-- 方法⑤：URL 参数 -->
      <div class="com-row">
        <span class="com-label">⑤ URL参数:</span>
        <span>filter = <code>{{ urlFilter }}</code></span>
      </div>
    </div>

    <!-- 性能优势说明 -->
    <div class="perf-note">
      ⚡ Proxy响应式：仅追踪实际访问的属性，内存占用更小
    </div>

    <div class="task-section">
      <div class="add-task">
        <input
          v-model="newTask"
          @keyup.enter="addTask"
          placeholder="输入新任务..."
        />
        <button @click="addTask">添加任务</button>
      </div>

      <div class="filter-bar">
        <button
          v-for="f in filters"
          :key="f.key"
          :class="{ active: filter === f.key }"
          @click="filter = f.key"
        >
          {{ f.label }}
        </button>
      </div>

      <ul class="task-list">
        <li
          v-for="(task, i) in filteredTasks"
          :key="i"
          @click="toggleTask(task)"
          :class="{ done: task.done }"
        >
          <span class="check">{{ task.done ? '✅' : '⬜' }}</span>
          {{ task.text }}
          <span class="close" @click.stop="removeTask(task)">×</span>
        </li>
        <li v-if="filteredTasks.length === 0" class="empty">暂无任务</li>
      </ul>
      <p class="stat">
        总计 {{ tasks.length }} | 已完成 {{ doneCount }}
        <span class="note">（computed自动缓存，依赖不变不重算）</span>
      </p>
    </div>

    <p class="footer-note">
      🔄 切换子应用时，当前组件卸载释放内存；返回时重新挂载
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 接收主应用传递的全部数据
const props = defineProps({ mainProps: { type: Object, default: () => ({}) } })

// ----- 任务管理逻辑 -----
const newTask = ref('')
const filter = ref('all')
const filters = [
  { key: 'all', label: '全部' },
  { key: 'active', label: '未完成' },
  { key: 'done', label: '已完成' },
]

const tasks = ref([
  { text: '理解微前端架构及优势', done: true },
  { text: '学习Vue3 Proxy响应式原理', done: false },
  { text: '练习Composition API组合函数', done: false },
])

const doneCount = computed(() => tasks.value.filter((t) => t.done).length)
const filteredTasks = computed(() => {
  if (filter.value === 'active') return tasks.value.filter((t) => !t.done)
  if (filter.value === 'done') return tasks.value.filter((t) => t.done)
  return tasks.value
})

function addTask() {
  const text = newTask.value.trim()
  if (text) {
    tasks.value.push({ text, done: false })
    newTask.value = ''
  }
}
function toggleTask(task) { task.done = !task.done }
function removeTask(task) {
  const idx = tasks.value.indexOf(task)
  if (idx > -1) tasks.value.splice(idx, 1)
}

// ===== 5 种双向通信方法实现 =====

// ① qiankun GlobalState：通过 actions.setGlobalState 回传数据
const gsNewUser = ref('')
function updateGlobalState() {
  const { actions } = props.mainProps || {}
  if (actions && actions.setGlobalState) {
    actions.setGlobalState({ user: gsNewUser.value, message: `Vue3 子应用回传 @ ${new Date().toLocaleTimeString()}` })
  }
}

// ② EventBus：收发事件
const eventMsg = ref('')
const lastEventMsg = ref('')
let unsubEventBus = null
function emitToMain() {
  const bus = props.mainProps?.eventBus || window.__MICRO_FE_EVENT_BUS__
  if (bus) bus.emit('sub-to-main', { from: 'vue3-app', text: eventMsg.value, time: Date.now() })
  eventMsg.value = ''
}

// ③ Props Callback：直接调用主应用传入的函数
function callPropsCallback() {
  const { onSubAppMessage } = props.mainProps || {}
  if (onSubAppMessage) {
    onSubAppMessage({ from: 'vue3-app', action: 'callPropsCallback', time: Date.now() })
  }
}

// ④ 共享 Store：读写 window 上的共享 store
const storeTheme = ref('light')
let unsubStore = null
function toggleTheme() {
  const store = props.mainProps?.sharedStore || window.__MICRO_FE_STORE__
  if (store) {
    const newTheme = store.get('theme') === 'light' ? 'dark' : 'light'
    store.setState({ theme: newTheme })
  }
}

// ⑤ URL 参数：读取当前 URL
const urlFilter = ref('')
function readURLParams() {
  const params = new URLSearchParams(window.location.search)
  urlFilter.value = params.get('filter') || '(无)'
}

// 生命周期：挂载时初始化监听，卸载时清理
onMounted(() => {
  // ② 监听主应用发来的事件
  const bus = props.mainProps?.eventBus || window.__MICRO_FE_EVENT_BUS__
  if (bus) {
    unsubEventBus = bus.on('main-to-sub', (data) => {
      lastEventMsg.value = data.text
    })
  }

  // ④ 订阅 Store 变更
  const store = props.mainProps?.sharedStore || window.__MICRO_FE_STORE__
  if (store) {
    storeTheme.value = store.get('theme') || 'light'
    unsubStore = store.subscribe((state) => {
      storeTheme.value = state.theme || 'light'
    })
  }

  // ⑤ 读取初始 URL 参数 + 监听 popstate
  readURLParams()
  window.addEventListener('popstate', readURLParams)
})

onUnmounted(() => {
  // 清理所有订阅，避免内存泄漏
  if (unsubEventBus) unsubEventBus()
  if (unsubStore) unsubStore()
  window.removeEventListener('popstate', readURLParams)
})
</script>

<style scoped>
.vue3-app {
  max-width: 680px;
  margin: 16px auto;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}
.app-header { display: flex; gap: 8px; margin-bottom: 16px; }
.badge {
  background: #42b883;
  color: #fff;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}
.badge-info {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;
}
h2 { color: #333; margin-bottom: 6px; font-size: 20px; }
.desc { color: #666; font-size: 14px; margin-bottom: 12px; }

/* 通信演示区域 */
.com-section {
  background: #f8f9fc;
  border: 1px solid #e0e0f0;
  border-radius: 10px;
  padding: 14px 18px;
  margin-bottom: 14px;
}
.com-section h4 {
  font-size: 13px;
  color: #667eea;
  margin-bottom: 10px;
}
.com-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
  font-size: 13px;
}
.com-row:last-child { border-bottom: none; }
.com-label {
  font-weight: 600;
  color: #555;
  min-width: 80px;
  font-size: 12px;
}
.com-row input {
  padding: 3px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  outline: none;
}
.com-row input:focus { border-color: #42b883; }
.com-row button {
  padding: 4px 10px;
  background: #42b883;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
}
.com-row button:hover { background: #35a070; }
.com-recv { color: #667eea; font-size: 11px; }
.com-row code {
  background: #e8f5e9;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 11px;
}

.perf-note {
  background: #fff8e1;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 12px;
  margin-bottom: 16px;
  color: #6d4c00;
}
.note { color: #999; font-size: 11px; margin-left: 6px; }

.task-section { margin-top: 16px; }
.add-task { display: flex; gap: 8px; margin-bottom: 12px; }
.add-task input {
  flex: 1;
  padding: 9px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}
.add-task input:focus { border-color: #42b883; }
.add-task button {
  padding: 9px 20px;
  background: #42b883;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}
.add-task button:hover { background: #35a070; }

.filter-bar { display: flex; gap: 6px; margin-bottom: 12px; }
.filter-bar button {
  padding: 4px 14px;
  border: 1px solid #ddd;
  border-radius: 14px;
  background: #fff;
  cursor: pointer;
  font-size: 12px;
  color: #666;
  transition: all 0.2s;
}
.filter-bar button.active {
  background: #42b883;
  color: #fff;
  border-color: #42b883;
}

.task-list { list-style: none; }
.task-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.15s;
}
.task-list li:hover { background: #fafafa; }
.task-list li.done { text-decoration: line-through; color: #aaa; }
.check { font-size: 14px; flex-shrink: 0; }
.close {
  margin-left: auto;
  color: #ccc;
  font-size: 16px;
  font-weight: bold;
  padding: 0 4px;
}
.close:hover { color: #e74c3c; }
.empty { color: #ccc; text-align: center; padding: 20px; cursor: default !important; }
.stat { margin-top: 14px; color: #666; font-size: 13px; }
.footer-note {
  margin-top: 20px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 12px;
  color: #888;
  text-align: center;
}
</style>
