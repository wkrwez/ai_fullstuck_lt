- 监听 request
  sever.on("request", (req, res) => {
  req.url //请求路径
  req.method //请求类型
  res.setHeader("Content-Type", "text/html; charset=utf-8"); //防止中文乱码，设置响应头
  res.end(`<h1>你好</h1>`); //返回响应
  });
