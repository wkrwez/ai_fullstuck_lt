1. 轮询

- 短轮询：每隔一段时间去请求一次
  - 高频次请求浪费带宽
- 长轮询：客户端发送请求，服务端直到有新内容才响应，之后客户端再次请求。只会返回对比上次的更新（增量更新）

  - 频繁建立连接和断开连接

2. websocket
   - 客户端发送特殊 http 请求，请求头包含（如 Upgrade: websocket 和 Connection: Upgrade），用于告知服务器希望升级到 WebSocket 协议。服务器支持会返回 101，之后可以相互通信，任何一方都可以断开连接（发送关闭帧）
   - 需要服务器支持，兼容性一般，复杂
   - 建立多个会造成服务器资源浪费
3. iframe
   - 通过隐藏的 iframe 标签的 src 指向服务器，服务器保持连接打开，不断以流的形式发送数据，数据为 script 标签形式，客户端执行这些脚本获取数据
4. sse
   - 单向通信，服务器以特定格式（通常是 text/event-stream）持续向客户端发送数据。意外中断浏览器会重连
   - 通过 EventSource 对象 建立连接
   - message：默认事件，用于接收服务器发送的消息。
   - open：当连接成功建立时触发。
   - error：当连接发生错误或断开时触发。
   - 也可以监听自定义事件

# axios 与 sse 的区别

1. axios 设计是基于 Promise 的处理普通 http 请求-响应的。在接到响应后会立即断开连接，而 SSE 是长连接，需要一直保持连接。
2. sse 在断开连接后浏览器会自动重连，而 axios 则需要开发者手动处理重连。
3. sse 是以流式传输数据，浏览器会自动解析 sse 的数据类型，而 axios 则需要开发者手动解析。
4. sse 是单向通信，仅支持 get 请求并且不能携带请求体，axios 更为灵活。
