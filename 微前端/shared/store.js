// ============================================================
// 方法④：共享 Store — 挂载到真实 window 上的响应式数据存储
// 主应用与子应用均可读写，适用场景：共享用户信息、主题、配置等
// ============================================================

const storeKey = '__MICRO_FE_STORE__'

function createSharedStore(initial = {}) {
  if (window[storeKey]) return window[storeKey]

  let state = { ...initial }
  const listeners = []

  const store = {
    // 获取全部状态
    getState() {
      return { ...state }
    },

    // 获取单个 key
    get(key) {
      return state[key]
    },

    // 设置状态（部分更新）
    setState(partial) {
      const prev = { ...state }
      state = { ...state, ...partial }
      listeners.forEach((fn) => fn(state, prev))
    },

    // 订阅变更
    subscribe(fn) {
      listeners.push(fn)
      return () => {
        const idx = listeners.indexOf(fn)
        if (idx > -1) listeners.splice(idx, 1)
      }
    },
  }

  window[storeKey] = store
  return store
}

export default createSharedStore({
  theme: 'light',
  notifications: [],
  lastActivity: null,
})
