# https 环境下嵌套使用 http 会被浏览器阻止，怎么解决？

1. 配置代理服务器把 http 代理成 https 请求，实际还是 http 请求
2. 使用沙盒，利用 a 标签或 window.open 打开新窗口
3. 升级目标服务器为 https
4. 禁用浏览器不让混合的机制
5. CSP

```
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests; default-src https: http://10.0.188.138:10807;">
```

- upgrade-insecure-requests：将所有 HTTP 请求自动升级为 HTTPS。
- default-src：指定允许加载的资源来源。

6. 如果目标 HTTP 内容是静态的（如 HTML 表格），可以将其下载并托管到 HTTPS 环境中。
