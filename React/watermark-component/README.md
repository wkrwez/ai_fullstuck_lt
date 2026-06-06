# Watermark 水印组件

基于 Canvas + CSS background-image 的 React 水印组件，支持文字水印和图片水印，具备防篡改能力（MutationObserver 自动修复）。

## 文件结构

```
src/
├── watermark.tsx       # 水印 React 组件（入口）
├── useWatermark.ts     # 水印核心 hook（Canvas 绘制 + DOM 挂载 + 防篡改）
├── App.tsx             # 使用示例
└── main.tsx            # 项目入口
```

## 架构概览

```
Watermark 组件 (watermark.tsx)
  │
  ├─ 接收用户配置 props（content / image / fontStyle / gap / offset / rotate …）
  ├─ 通过 useRef + useCallback 确定水印挂载容器 getContainer
  │
  └─ 调用 useWatermark hook  ─────────────────────────────┐
                                                          │
useWatermark (useWatermark.ts)                            │
  │                                                       │
  ├─ getMergedOptions()                                    │
  │   合并用户选项与默认值，做数字类型转换                    │
  │                                                       │
  ├─ drawWatermark()  ◄── 核心绘制方法                      │
  │   │                                                   │
  │   ├─ getCanvasData()  ─── Canvas 离屏渲染               │
  │   │   ├─ drawText()  文字水印                          │
  │   │   │   ├─ measureTextSize() 测量旋转后外接矩形        │
  │   │   │   ├─ configCanvas()  设置画布尺寸 + 旋转变换     │
  │   │   │   └─ ctx.fillText() 逐行绘制居中文字             │
  │   │   │                                               │
  │   │   └─ drawImage() 图片水印                          │
  │   │       ├─ new Image() 加载图片                      │
  │   │       ├─ 等比例计算宽高                             │
  │   │       ├─ ctx.drawImage() 绘制居中图片               │
  │   │       └─ onerror → 降级为 drawText()               │
  │   │                                                   │
  │   ├─ 创建/更新水印 div                                  │
  │   │   ├─ CSS background-image 平铺 base64 水印图        │
  │   │   ├─ position: absolute 覆盖容器                    │
  │   │   └─ pointer-events: none 不阻挡用户交互             │
  │   │                                                   │
  │   └─ MutationObserver 防篡改监听                        │
  │       ├─ 水印 div 被删除 → 重建                         │
  │       └─ 水印 div 属性被改 → 重建                        │
  │                                                       │
  └─ 返回 { generateWatermark, destroy }                   │
```

## 细致执行步骤

### 第一步：组件挂载（`Watermark` 组件，[watermark.tsx](src/watermark.tsx)）

1. React 调用 `Watermark` 函数组件，传入 `WatermarkProps` 配置
2. 解构 props 得到 `zIndex`、`width`、`height`、`rotate`、`image`、`content`、`fontStyle`、`gap`、`offset` 等配置项
3. 创建 `containerRef`（`useRef<HTMLDivElement>`），用于持有 wrapper div 的 DOM 引用
4. 定义 `getContainer` 回调（`useCallback`）：若用户传了 `props.getContainer` 则调用之，否则返回 `containerRef.current`（即 wrapper div 自身）
5. 调用 `useWatermark()` hook，将所有配置项 + `getContainer` 传入，获取 `{ generateWatermark }`

### 第二步：选项合并（`getMergedOptions`，[useWatermark.ts:41](src/useWatermark.ts#L41)）

1. 拿到用户传入的原始 options 和默认值 `defaultOptions`
2. `rotate`：用户值 || -20
3. `zIndex`：用户值 || 1
4. `fontStyle`：展开默认字体样式，再用用户值覆盖（`{ ...default, ...user }`）
5. `width`：通过 `toNumber()` 将字符串转数字；图片模式下若未指定则默认 100
6. `height`：通过 `toNumber()` 转数字
7. `gap`：`[toNumber(gap[0], 100), toNumber(gap[1] || gap[0], 100)]`
8. `offset`：`[toNumber(offset[0], 0), toNumber(offset[1] || offset[0], 0)]`
9. 返回所有字段均已填充的 `Required<WatermarkOptions>`

### 第三步：首次绘制（`drawWatermark`，[useWatermark.ts:174](src/useWatermark.ts#L174)）

1. 检查 `container` 是否存在，不存在则直接返回
2. **调用 `getCanvasData(mergedOptions)`** 生成水印图案的 base64 DataURL（详见第四步）
3. `.then()` 回调中收到 `{ base64Url, width, height }`
4. 构造水印 div 的内联样式字符串 `wmStyle`：
   - `position: absolute` + `top/left/bottom/right` 覆盖整个容器（减去 offset）
   - `pointer-events: none` 让水印不阻挡用户点击
   - `z-index` 控制层级
   - `background-image: url(base64Url)` + `background-repeat: repeat` 平铺水印
   - `background-size` 设为 `gap + 水印单元尺寸`，控制平铺间距
5. 若 `watermarkDiv.current` 为空 → 创建新 div、追加到容器、设置容器 `position: relative`
6. 若已存在 → 更新 div 的 style 属性为新样式字符串
7. **启动 MutationObserver** 防止水印被篡改（详见第五步）

### 第四步：Canvas 离屏渲染（`getCanvasData`，[useWatermark.ts:71](src/useWatermark.ts#L71)）

1. 创建离屏 `<canvas>` 元素，获取 2D 渲染上下文
2. 获取 `window.devicePixelRatio` 作为缩放比，保证高清屏不模糊

#### 4a. 文字水印路径（无 `image` 或图片加载失败时）

1. **`configCanvas(size)`**（[useWatermark.ts:82](src/useWatermark.ts#L82)）：
   - 画布物理像素尺寸 = `(gap + contentSize) × ratio`
   - 画布 CSS 显示尺寸 = `gap + contentSize`
   - `ctx.translate()` 将坐标原点移到画布中心
   - `ctx.scale(ratio, ratio)` 适配高清屏
   - `ctx.rotate(rotate * π / 180)` 应用旋转角度
2. **`measureTextSize(ctx, content, rotate)`**（[useWatermark.ts:254](src/useWatermark.ts#L254)）：
   - 用 `ctx.measureText()` 测量每行文字的 `fontBoundingBoxAscent + fontBoundingBoxDescent` 得到行高
   - 记录最大行宽、累计总高度、每行独立尺寸
   - 按旋转角度计算外接矩形：
     - `rotatedWidth = |sinθ| × height + |cosθ| × width`
     - `rotatedHeight = |sinθ| × width + |cosθ| × height`
   - 取 `Math.ceil` 向上取整
3. **逐行绘制文字**：
   - `x = -lineWidth / 2`（行水平居中于原点）
   - `y = -(totalHeight) / 2 + lineHeight × index`（整体垂直居中，每行向下偏移）
   - `ctx.fillText(item, x, y, maxWidth)` 带最大宽度限制

#### 4b. 图片水印路径（有 `image` 时）

1. 创建 `new Image()`，设置 `crossOrigin = "anonymous"` 和 `referrerPolicy = "no-referrer"`
2. `img.onload`：若只指定了宽或高，按原图比例计算另一边；调用 `configCanvas`；`ctx.drawImage()` 以画布中心为原点居中绘制
3. `img.onerror`：降级调用 `drawText()` 绘制文字水印

### 第五步：防篡改监听（MutationObserver，[useWatermark.ts:210](src/useWatermark.ts#L210)）

1. 每次 `drawWatermark` 执行时，先 `disconnect()` 旧的观察器
2. 创建新的 `MutationObserver`，监听容器的：
   - `childList: true` → 子节点增删
   - `attributes: true` → 属性变化
   - `subtree: true` → 子树中任意节点的变化
3. 回调中检测两类破坏行为：
   - **水印 div 被从 DOM 中移除**：遍历 `mutation.removedNodes`，判断是否包含 `watermarkDiv.current`
   - **水印 div 的属性被修改**：`mutation.type === "attributes"` 且 `mutation.target === watermarkDiv.current`
4. 检测到破坏后：
   - 从父节点移除残留的水印 div
   - 将 `watermarkDiv.current` 置为 `undefined`
   - 递归调用 `drawWatermark()` 重建水印

### 第六步：响应属性变化（useEffect，[watermark.tsx:65](src/watermark.tsx#L65)）

1. `useEffect` 依赖项包含所有水印配置字段
2. 对于对象/数组类型（`fontStyle`、`gap`、`offset`），使用 `JSON.stringify()` 做浅层内容比较
3. 任一依赖变化 → 调用 `generateWatermark(newOptions)` → hook 内部 `setOptions(merge({}, options, newOptions))` 更新状态 → 触发 `drawWatermark()` 重新绘制

### 第七步：渲染子内容（[watermark.tsx:91](src/watermark.tsx#L91)）

1. 若 `props.children` 存在 → 渲染带 `ref={containerRef}` 的 `<div>` 包裹子内容
2. 若 `children` 为 falsy → 返回 `null`，不渲染任何 wrapper DOM（此时必须通过 `getContainer` 指定挂载点，否则水印无容器可挂）

## 关键设计点

| 设计点 | 说明 |
|--------|------|
| Canvas 离屏渲染 | 不依赖 DOM 截图，纯 API 绘制，性能好、无 XSS 风险 |
| devicePixelRatio | canvas 物理像素按 dpr 放大，保证 Retina 屏清晰 |
| 旋转外接矩形 | 文字旋转后计算外接矩形尺寸，避免画布不够大导致截断 |
| 图片降级 | 图片加载失败时自动切换为文字水印，不中断功能 |
| MutationObserver | 防删除 + 防属性篡改，自动修复 |
| pointer-events: none | 水印层不拦截鼠标/触摸事件 |
| JSON.stringify 依赖 | 对象/数组类型 props 通过序列化比较，避免引用变化导致无效重绘 |
| lodash merge | 支持增量更新配置，未传的字段保留旧值 |

## Props 参考

详见 [watermark.tsx](src/watermark.tsx) 中的 `WatermarkProps` 接口定义，每个字段均有注释说明。
