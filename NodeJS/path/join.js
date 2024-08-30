const fs = require("fs");
const path = require("path");
const join = path.join("/a", "/b/c", "../", "/d");
// console.log(join);

//使用加号拼接无法正确识别./index.txt,需要去掉‘.’。

fs.readFile(
  path.join(__dirname + "./index.txt"),
  "utf-8",
  function (err, data) {
    console.log(data);
  }
);
