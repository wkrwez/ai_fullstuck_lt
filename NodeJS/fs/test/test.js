const fs = require("fs");
const data = fs.readFile("./grade.txt", "utf-8", function (err, dataStr) {
  //两种方法
  //   let res = dataStr.replace(/=/g, "：");
  //   let str = res.replace(/ /g, "\n");    //  /=/g匹配所有=，表示匹配全部，replace不会修改原字符串，会产生新的

  const data = dataStr.split(" ").join("\n");
  const str = data.replace(/=/g, ": ");
  console.log(str);
  fs.writeFile("grade-ok.txt", str, function (err) {
    console.log(err); //写入成功为null，失败为错误对象
  });
});
