import {
  registerMicroApps,
  start,
  setDefaultMountApp,
  initGlobalState,
} from 'qiankun'
import './style.css'
import eventBus from '../../shared/eventBus.js'
import sharedStore from '../../shared/store.js'

// ============================================================
// 微前端双向通信 — 5 种方法演示
// ============================================================

// ----- 方法①：qiankun initGlobalState（全局状态）-----
// qiankun 内置方案：主应用创建，子应用通过 props.actions 调用 setGlobalState 回传数据
const actions = initGlobalState({ user: '开发者', message: '' })
actions.onGlobalStateChange((state, prev) => {
  console.log('[主应用·方法①] 全局状态变更:', state, prev)
  updateComPanel('global-state-prev', JSON.stringify(prev))
  updateComPanel('global-state-curr', JSON.stringify(state))
})

// ----- 方法②：自定义 EventBus（发布/订阅）-----
eventBus.on('sub-to-main', (data) => {
  console.log('[主应用·方法②] 收到子应用事件:', data)
  addEventLog(`← 子应用: ${JSON.stringify(data)}`)
})

// ----- 方法④：共享 window Store -----
sharedStore.subscribe((state) => {
  console.log('[主应用·方法④] Store 变更:', state)
  updateComPanel('store-display', JSON.stringify(state, null, 2))
})

// ----- 主应用内部：通信面板 DOM 操作 -----
function updateComPanel(id, text) {
  const el = document.getElementById(id)
  if (el) el.textContent = text
}
function addEventLog(msg) {
  const list = document.getElementById('event-log')
  if (!list) return
  const time = new Date().toLocaleTimeString()
  const li = document.createElement('li')
  li.textContent = `[${time}] ${msg}`
  list.prepend(li)
  if (list.children.length > 20) list.removeChild(list.lastChild)
}

// 暴露到 window 方便 index.html 中的 onclick 调用
window.__mainActions = {
  // 方法①：更新全局状态
  updateGlobalState() {
    const input = document.getElementById('gs-input')
    actions.setGlobalState({ user: input.value || '开发者' })
  },
  // 方法②：通过 EventBus 向子应用发送消息
  emitEvent() {
    const input = document.getElementById('event-input')
    const msg = input.value || 'Hello from main'
    eventBus.emit('main-to-sub', { text: msg, time: Date.now() })
    addEventLog(`→ 发送到子应用: ${msg}`)
    input.value = ''
  },
  // 方法③ (props+callback) 在主应用侧的触发——通过 actions.setGlobalState 间接触发 update 生命周期
  // 子应用通过 props 收到 callback，这里是接收端的日志
  callSubAppCallback() {
    // 主应用通过更新全局状态，子应用的 update 钩子会被调用
    actions.setGlobalState({
      message: `主应用回调触发 @ ${new Date().toLocaleTimeString()}`,
    })
  },
  // 方法④：更新共享 Store
  updateStore() {
    const keyInput = document.getElementById('store-key')
    const valInput = document.getElementById('store-val')
    const key = keyInput.value || 'lastActivity'
    sharedStore.setState({ [key]: valInput.value, lastActivity: Date.now() })
    keyInput.value = ''
    valInput.value = ''
  },
  // 方法⑤：更新 URL 参数（子应用可读取）
  updateURL() {
    const input = document.getElementById('url-input')
    const url = new URL(window.location)
    url.searchParams.set('filter', input.value || 'all')
    history.pushState(null, '', url.toString())
    updateComPanel('url-display', url.search)
    // 子应用可通过 URLSearchParams / location.search 读取
  },
}

// ===== 微前端核心配置 =====

function loader(loading) {
  const el = document.getElementById('loading-indicator')
  if (el) el.style.display = loading ? 'block' : 'none'
}

const perfStart = {}
function trackLoad(appName) {
  perfStart[appName] = performance.now()
}
function trackDone(appName) {
  const t = (performance.now() - perfStart[appName]).toFixed(0)
  const el = document.getElementById('perf-info')
  if (el) el.textContent = `${appName} 加载耗时: ${t}ms`
}

registerMicroApps(
  [
    {
      name: 'vue3-app',
      entry: '//localhost:8001',
      container: '#sub-app-container',
      activeRule: '/vue3',
      loader,
      // 方法③：通过 props 传递回调函数给子应用，子应用调用即可回传数据
      props: {
        actions,
        // 方法②：将 event bus 引用也传下去
        eventBus,
        // 方法④：将 store 引用传下去
        sharedStore,
        // 方法③：回调函数 — 子应用直接调用即可通知主应用
        onSubAppMessage(data) {
          console.log('[主应用·方法③] Props 回调收到:', data)
          addEventLog(`← Props回调: ${JSON.stringify(data)}`)
        },
      },
    },
    {
      name: 'react-app',
      entry: '//localhost:8002',
      container: '#sub-app-container',
      activeRule: '/react',
      loader,
      props: {
        actions,
        eventBus,
        sharedStore,
        onSubAppMessage(data) {
          console.log('[主应用·方法③] Props 回调收到:', data)
          addEventLog(`← Props回调: ${JSON.stringify(data)}`)
        },
      },
    },
  ],
  {
    beforeLoad: (app) => {
      trackLoad(app.name)
      console.log(`[${app.name}] 开始加载`)
    },
    afterMount: (app) => {
      trackDone(app.name)
      console.log(`[${app.name}] 挂载完成`)
    },
    onLoadError: (app) =>
      console.error(`[${app.name}] 加载失败，检查子应用是否启动`),
  }
)

setDefaultMountApp('/vue3')

start({
  prefetch: true,
  sandbox: { experimentalStyleIsolation: true },
})

// ===== 导航路由处理 =====
document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    const href = link.getAttribute('href')
    history.pushState(null, '', href)
    window.dispatchEvent(new PopStateEvent('popstate'))
    document
      .querySelectorAll('.nav-link')
      .forEach((l) => l.classList.remove('active'))
    link.classList.add('active')
  })
})

const path = window.location.pathname
const active = document.querySelector(`[href="${path}"]`)
if (active) active.classList.add('active')

// 初始化显示
updateComPanel('url-display', window.location.search || '(无参数)')
