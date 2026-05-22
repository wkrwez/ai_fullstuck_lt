# 第一层 网络层

DNS预解析（<link rel=“dns-prefetch”/>）
减少HTTP请求（合并、雪碧图、iconfont）
开启http2（多路复用，减少队头阻塞）
CDN（不仅加速，还降低带宽压力）带宽大也要CDN，因为能够减少RTT，提升并发能力

# 第二层 资源层

压缩：Gzip/Brotli、图片Webp/AVIF；
缓存：强缓存+协商缓存
按需加载“路由懒加载、图片懒加载

# 第三层 渲染层

- 关键渲染路径优化：
- 内联关键css
- 异步加载非关键js（defer，async）
- 减少重排重绘
- 用transform代替left/top
  - left/top是布局属性 ：重排 -》重绘-》合成
  - transform是合成属性：合成
  - transform：浏览器会把元素单独提升为一个独立图层，用 GPU 直接加速渲染，完全不影响其他元素。
- 批量读、写DOM操作。
  - 每次读-》写 都会触发重排，读取浏览器布局属性会触发重排（offsetWidth/offsetTop/scrollTop / scrollHeight）；修改属性浏览器会安排到一次更新
  - 读、写分离，批量处理，减少重排次数
- 关键资源预加载（<link rel=“preload”/>）

# 思考：

## 用数据

1. Chrome DevTools -> NetWork：看哪个资源耗时最长（单个大图，还是第三方脚本）
2. Performance面板：看火焰图，是js执行时间长，还是HTML解析时间长，还是重排重绘频繁
3. LightHouse：给出具体评分和优化建议

## 用户感知

1. 首屏加载：用SSR或预渲染解决白屏问题
2. js交互：代码分割，减小首屏js体积
3. 慢网络：用Service Work做离线缓存

## 最坏情况

用户使用3G,低端安卓机
降级方案：低质量图片、禁用非必要动画、减少长任务
