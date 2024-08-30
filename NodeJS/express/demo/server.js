// const http = require("http");

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader("Content-Type", "text/html;charset=utf-8");
//   res.end("Hello, Express!");
// });

// server.listen(8080, () => {
//   console.log("服务端启动成功");
// });

//使用express搭建
const express = require("express");
const app = express();

//---------字符串路由路径----------
// app.get("/", (req, res) => {
//   console.log(req.query); //前端请求携带内容
//   res.send("Hello, Express len!");
// });

// app.get("/user", (req, res) => {
//   res.send("User Page");
// });

// //---------字符模式路由路径----------
// app.get("ab?cd", (req, res) => {
//   //？代表b可有可无
//   res.send("User Page");
// });

// app.get("ab+cd", (req, res) => {
//   //+代表b至少有一个
//   res.send("User Page");
// });

// app.get("ab*cd", (req, res) => {
//   //*代表中间任意内容，数量
//   res.send("User Page");
// });

// //---------正则路由路径----------
// app.get(/a/, (req, res) => {
//   //使用正则匹配路径
//   res.send("User Page");
// });

//---------路由拆分----------
// app.get("user/list", (req, res) => {
//   res.send("user list");
// });

// app.get("user/goods", (req, res) => {
//   res.send("user goods");
// });

// //拆分后
// const user = express.Router();

// user.get("/list", (req, res) => {
//   res.send("user list");
// });

// app.use("/user", user);

//---------中间键----------

// function middleware(req, res, next) {
//   console.log("全局中间键执行，所有的路由都会导致执行");
//   next();
// }

// app.use(middleware); //局部中间键不需要use

// app.get(
//   "/",
//   function (req, res, next) {
//     console.log("局部中间键执行，该路由都会导致执行");
//     next(); //不使用会导致下面不会执行
//   },
//   (req, res) => {
//     res.send("Hello, Express len!");
//   }
// );

//---------打印日志----------

// function logger(req, res, next) {
//   const time = new Date().toLocaleString();
//   console.log(`[${time}] ${req.method} ${req.url}`);
//   next();
// }

// // app.use(logger);

// app.get("/", logger, (req, res) => {
//   res.send("Hello, Express len!");
// });

//---------模版引擎----------

//静态资源中间键
app.use(express.static("./public"));
//指定模版存放目录
app.set("views", "view");
// 指定引擎模版为handlebars
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  //读取目录的index文件,添加参数动态渲染
  res.render("index", {
    title: "Express",
    content: "Hello, Express!",
  });
});

app.get("/about", (req, res) => {
  //   throw new Error("404");
  res.render("about", {
    title: "Express",
    content: "Hello, Express!",
  });
});

//放到最后面，当没有路由匹配就会访问到这里
app.use("*", (req, res) => {
  res.status(404).render("404", {
    title: "Express",
    content: `${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  res.status(500).render("500", {
    title: "Express",
    content: `${err}`,
  });
});

app.listen(8080, () => {
  console.log("服务端启动成功");
});
