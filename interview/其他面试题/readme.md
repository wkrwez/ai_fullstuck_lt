# 如何判断 PC 还是移动端

1. 通过 user-agent 判断
   浏览器会向服务端发送 user-agent 请求头字段，可以通过 navigator.userAgent 获取设备信息
   - 缺点是用户可以伪造 user-agent，所以不能完全依赖它
2. 通过监听触摸事件
   - 缺点是 PC 端现在也存在触屏功能
3. 通过屏幕宽度判断
   - 平板误判
4. css 媒体查询判断宽度
   - 实现复杂，会误判
5. 综合 user-agent 和屏幕宽度判断
