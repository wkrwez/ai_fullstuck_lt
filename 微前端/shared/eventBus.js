// ============================================================
// 方法②：自定义事件总线 — 发布/订阅模式，主应用与子应用双向通信
// 挂载到真实 window 上，确保跨 qiankun 沙箱可访问
// ============================================================

const busKey = '__MICRO_FE_EVENT_BUS__'

function createEventBus() {
  if (window[busKey]) return window[busKey]

  const listeners = {}

  const bus = {
    // 订阅事件
    on(event, fn) {
      if (!listeners[event]) listeners[event] = []
      listeners[event].push(fn)
      // 返回取消订阅函数
      return () => this.off(event, fn)
    },

    // 发布事件（通知所有订阅者）
    emit(event, data) {
      ;(listeners[event] || []).forEach((fn) => fn(data))
    },

    // 取消订阅
    off(event, fn) {
      const fns = listeners[event]
      if (fns) {
        listeners[event] = fns.filter((f) => f !== fn)
      }
    },

    // 一次性订阅
    once(event, fn) {
      const wrapper = (data) => {
        fn(data)
        this.off(event, wrapper)
      }
      this.on(event, wrapper)
    },
  }

  window[busKey] = bus
  return bus
}

export default createEventBus()
