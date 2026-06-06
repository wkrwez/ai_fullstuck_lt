import { useState, useEffect, useMemo, useCallback } from 'react'
import './App.css'

const mockUsers = [
  { id: 1, name: '张三', role: '前端开发', status: 'online' },
  { id: 2, name: '李四', role: '后端开发', status: 'offline' },
  { id: 3, name: '王五', role: 'UI设计师', status: 'online' },
  { id: 4, name: '赵六', role: '产品经理', status: 'busy' },
  { id: 5, name: '孙七', role: '前端开发', status: 'online' },
]

const statusMap = {
  online: { label: '在线', cls: 'online' },
  offline: { label: '离线', cls: 'offline' },
  busy: { label: '忙碌', cls: 'busy' },
}

export default function App({ mainProps }) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [users] = useState(mockUsers)

  // ===== 通信状态 =====
  const [gsNewUser, setGsNewUser] = useState('')
  const [eventMsg, setEventMsg] = useState('')
  const [lastEventMsg, setLastEventMsg] = useState('')
  const [storeTheme, setStoreTheme] = useState('light')
  const [urlFilter, setUrlFilter] = useState('')

  // 从 props 解包通信工具
  const { actions, eventBus, sharedStore, onSubAppMessage } = mainProps || {}

  // ① qiankun GlobalState：通过 actions.setGlobalState 回传
  const updateGlobalState = useCallback(() => {
    if (actions && actions.setGlobalState) {
      actions.setGlobalState({
        user: gsNewUser,
        message: `React 子应用回传 @ ${new Date().toLocaleTimeString()}`,
      })
    }
  }, [actions, gsNewUser])

  // ② EventBus：发送给主应用
  const emitToMain = useCallback(() => {
    const bus = eventBus || window.__MICRO_FE_EVENT_BUS__
    if (bus) {
      bus.emit('sub-to-main', {
        from: 'react-app',
        text: eventMsg,
        time: Date.now(),
      })
      setEventMsg('')
    }
  }, [eventBus, eventMsg])

  // ③ Props 回调
  const callPropsCallback = useCallback(() => {
    if (onSubAppMessage) {
      onSubAppMessage({
        from: 'react-app',
        action: 'callPropsCallback',
        time: Date.now(),
      })
    }
  }, [onSubAppMessage])

  // ④ 共享 Store：切换主题
  const toggleTheme = useCallback(() => {
    const store = sharedStore || window.__MICRO_FE_STORE__
    if (store) {
      const newTheme = store.get('theme') === 'light' ? 'dark' : 'light'
      store.setState({ theme: newTheme })
    }
  }, [sharedStore])

  // ⑤ 读取 URL 参数
  const readURLParams = useCallback(() => {
    const params = new URLSearchParams(window.location.search)
    setUrlFilter(params.get('filter') || '(无)')
  }, [])

  // 生命周期
  useEffect(() => {
    console.log('[React子应用] 组件已挂载')

    // ② 监听主应用事件
    const bus = eventBus || window.__MICRO_FE_EVENT_BUS__
    let unsubEvent = null
    if (bus) {
      unsubEvent = bus.on('main-to-sub', (data) => {
        setLastEventMsg(data.text)
      })
    }

    // ④ 订阅 Store
    let unsubStore = null
    const store = sharedStore || window.__MICRO_FE_STORE__
    if (store) {
      setStoreTheme(store.get('theme') || 'light')
      unsubStore = store.subscribe((state) => {
        setStoreTheme(state.theme || 'light')
      })
    }

    // ⑤ 读取 URL + 监听
    readURLParams()
    window.addEventListener('popstate', readURLParams)

    return () => {
      console.log('[React子应用] 组件将卸载 - 清理副作用')
      if (unsubEvent) unsubEvent()
      if (unsubStore) unsubStore()
      window.removeEventListener('popstate', readURLParams)
    }
  }, [eventBus, sharedStore, readURLParams])

  // useMemo: 搜索结果缓存
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search || u.name.includes(search) || u.role.includes(search)
      const matchRole = roleFilter === 'all' || u.role === roleFilter
      return matchSearch && matchRole
    })
  }, [users, search, roleFilter])

  const handleSearch = useCallback((e) => setSearch(e.target.value), [])
  const handleRoleFilter = useCallback((role) => setRoleFilter(role), [])

  return (
    <div className="react-app">
      <div className="app-header">
        <span className="badge react-badge">React 18</span>
        <span className="badge-info">独立子应用</span>
      </div>

      <h2>团队成员管理</h2>
      <p className="desc">
        此页面由 <strong>React Hooks</strong> 驱动，独立开发、独立部署
      </p>

      {/* ===== 通信演示区域 ===== */}
      <div className="com-section">
        <h4>双向通信演示（子应用端）</h4>

        {/* ① GlobalState */}
        <div className="com-row">
          <span className="com-label">① GlobalState:</span>
          <span>
            user = <strong>{mainProps?.user || '—'}</strong>
          </span>
          <input
            value={gsNewUser}
            onChange={(e) => setGsNewUser(e.target.value)}
            placeholder="新用户名"
            size="12"
          />
          <button onClick={updateGlobalState}>回传给主应用</button>
        </div>

        {/* ② EventBus */}
        <div className="com-row">
          <span className="com-label">② EventBus:</span>
          <input
            value={eventMsg}
            onChange={(e) => setEventMsg(e.target.value)}
            placeholder="消息内容"
            size="14"
          />
          <button onClick={emitToMain}>发送给主应用</button>
          {lastEventMsg && (
            <span className="com-recv">收到: {lastEventMsg}</span>
          )}
        </div>

        {/* ③ Props回调 */}
        <div className="com-row">
          <span className="com-label">③ Props回调:</span>
          <button onClick={callPropsCallback}>调用主应用回调</button>
          <span className="note">（主应用日志区可见）</span>
        </div>

        {/* ④ 共享Store */}
        <div className="com-row">
          <span className="com-label">④ Store:</span>
          <span>
            theme = <strong>{storeTheme}</strong>
          </span>
          <button onClick={toggleTheme}>切换主题</button>
          <span className="note">（主应用+所有子应用同步）</span>
        </div>

        {/* ⑤ URL参数 */}
        <div className="com-row">
          <span className="com-label">⑤ URL参数:</span>
          <span>
            filter = <code>{urlFilter}</code>
          </span>
        </div>
      </div>

      {/* 性能优势说明 */}
      <div className="perf-note">
        ⚡ useMemo缓存过滤结果，仅依赖变化时重新计算
      </div>

      <div className="user-section">
        <div className="search-bar">
          <input
            value={search}
            onChange={handleSearch}
            placeholder="搜索姓名或角色..."
          />
        </div>

        <div className="filter-bar">
          <button
            className={roleFilter === 'all' ? 'active' : ''}
            onClick={() => handleRoleFilter('all')}
          >
            全部 ({users.length})
          </button>
          <button
            className={roleFilter === '前端开发' ? 'active' : ''}
            onClick={() => handleRoleFilter('前端开发')}
          >
            前端
          </button>
          <button
            className={roleFilter === '后端开发' ? 'active' : ''}
            onClick={() => handleRoleFilter('后端开发')}
          >
            后端
          </button>
          <button
            className={roleFilter === 'UI设计师' ? 'active' : ''}
            onClick={() => handleRoleFilter('UI设计师')}
          >
            设计
          </button>
        </div>

        <ul className="user-list">
          {filteredUsers.length === 0 ? (
            <li className="empty">无匹配成员</li>
          ) : (
            filteredUsers.map((user) => {
              const s = statusMap[user.status]
              return (
                <li key={user.id}>
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">{user.role}</span>
                  <span className={`status ${s.cls}`}>{s.label}</span>
                </li>
              )
            })
          )}
        </ul>
        <p className="stat">
          显示 {filteredUsers.length}/{users.length} 名成员
          <span className="note">（useMemo缓存，输入不变不重算）</span>
        </p>
      </div>

      <p className="footer-note">
        🔄 切换子应用时，React组件卸载释放内存；返回时新实例挂载
      </p>
    </div>
  )
}
