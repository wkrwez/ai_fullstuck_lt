# 一万个节点操作卡顿？

1. 采用 onlyRenderVisibleElements 属性，只显示在视图区域的节点。
2. 节点数量过多时关闭 MiniMap，因为它内部会把每一个节点渲染成一个 SVG <rect> 色块，拖拽一个节点时MiniMap都要重新计算并重绘一万个色块，这是React Flow 内部的固定开销。
3. 设置跳跃
4. 没有使用 useMemo 或 useCallback 进行缓存
