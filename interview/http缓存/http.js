const http = require('http');
const url = require('url');
// 绝对路径相对路径
const path = require('path');
// node 自带的文件系统
const fs = require('fs');

// 前后端不分离，把一个静态资源返回给前端
const server = http.createServer((req, res) => {
  // __dirname当前js文件的绝对路径
  // 将前端请求的地址转换成url格式，再拼接www这个路径，最后读取整个文件的绝对路径
  let filePath = path.resolve(__dirname, path.join('www', url.fileURLToPath(`file:///${req.url}`)))
  // console.log(filePath);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath)//读取文件的详细参数

    const isDir = stats.isDirectory()// 用来判断读到的是文件还是文件夹
    if (isDir) {
      filePath = path.join(filePath, 'index.html')
    }
    if (!isDir || fs.existsSync(filePath)) {
      // 读取资源文件向前端返回
      const content = fs.readFileSync(filePath) // 读取文件

      console.log(content);
    }

  }
})

server.listen(3000, () => {
  console.log('server is running at port 3000')
});