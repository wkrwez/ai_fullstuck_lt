const path = require("path");
const fs = require("fs");

const res = /<style>[\s\S]*<\/style>/;
const res2 = /<script[\s\S]*<\/script>/;
const fileRold = path.join(__dirname, "./index.html");

fs.readFile(fileRold, "utf-8", function (err, data) {
  //   resolveCss(data);
  //   resolveJs(data);

  resolveHtml(data);
});

function resolveCss(data) {
  const str = res.exec(data);
  const str3 = str[0].replace(/<style>|<\/style>/g, "");

  fs.writeFile("style.css", str3, function (err) {
    if (err === null) {
      console.log("css写入成功");
    } else {
      console.log("css写入失败");
    }
  });
}

function resolveJs(data) {
  const str2 = res2.exec(data);

  const str4 = str2[0].replace(/<script>|<\/script>/g, "");

  fs.writeFile("script.js", str2[0], function (err) {
    if (err === null) {
      console.log("js写入成功");
    } else {
      console.log("js写入失败");
    }
  });
}

function resolveHtml(data) {
  const str = data
    .replace(res, '<link rel="stylesheet" href="./style.css">')
    .replace(res2, '<script src="./script.js"></script>');

  fs.writeFile("index.html", str, function (err) {
    if (err === null) {
      console.log("html写入成功");
    } else {
      console.log("html写入失败");
    }
  });
}
