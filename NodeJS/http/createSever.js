const http = require("http");
const fs = require("fs");
const path = require("path");

const sever = http.createServer();

sever.on("request", (req, res) => {
  const url = req.url;

  let str = "";
  if (url === "/") {
    str = path.join(__dirname, "/index.html");
  } else {
    str = path.join(__dirname, url);
  }
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  fs.readFile(str, "utf8", function (err, data) {
    if (err === null) {
      res.end(data);
    } else {
      res.end("404 not found");
    }
  });
});

sever.listen(8080, () => {
  console.log("服务端启动成功");
});
