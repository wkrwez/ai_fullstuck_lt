nodemon
npm i nodemon --save-dev
package.json start: "node -> nodemon
npm run start

- express 请求
  app.method(url, (req, res) => {})
  app.all(url, (req, res) => {}), 这个路径所有请求都可以使用

- static 资源
  app.use(express.static('public'))
  在文件引入的时候不需要写 public，直接/css/xxx.css
