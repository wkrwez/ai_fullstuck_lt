import { createApp } from 'vue'
import App from './App.vue'

let app = null

// 通用渲染函数 - 兼容qiankun容器和独立运行
function render(props = {}) {
  const { container } = props
  const mountNode = container
    ? container.querySelector('#app')
    : document.getElementById('app')
  app = createApp(App, { mainProps: props })
  app.mount(mountNode)
}

// qiankun生命周期钩子（通过index.html桥接脚本调用）
// bootstrap: 初始化时调用一次（预加载时可提前执行）
// mount: 每次进入子应用时调用，执行DOM挂载
// unmount: 每次离开时调用，必须销毁实例避免内存泄漏
export function bootstrap() {
  console.log('[Vue3] 初始化完成 - bootstrap阶段可做资源预加载')
}

export function mount(props) {
  render(props)
  console.log('[Vue3] 已挂载，收到主应用数据:', props)
}

export function unmount() {
  app.unmount()
  app = null
  console.log('[Vue3] 已卸载 - 释放内存')
}

export function update(props) {
  console.log('[Vue3] 主应用数据更新:', props)
}
