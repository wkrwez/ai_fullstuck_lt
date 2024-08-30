const fs = require("fs");
/**
 * 读取文件
 * 1:读取文件相对路径
 * 2:可选，读取文件采用编码格式，默认utf-8
 * 3:回调函数，拿到失败err，成功dataStr
 *
 * 问题：使用相对路径读取文件实际上是在文件路径上拼接你写的文件路径，如果不在正确的路径上执行会报错，比如在fs上node执行没问题，但是在NodeJS上执行会报错
 * 解决：1.使用绝对路径读取文件 2.__dirname代表当前文件的所处的目录
 *
 */

// const data = fs.readFile("./index.txt", "utf-8", function (err, dataStr) {
//   console.log(err); //成功为null，失败为错误对象

//   console.log(dataStr); //成功为文件内容，失败为undefined
// });

/**
 * 写入文件
 * 1:文件存放路径
 * 2:要写入的内容
 * 3:可选，写入文件采用编码格式，默认utf-8
 * 4:回调函数，拿到失败err，成功dataStr
 *
 * 会自动创建文件写入
 */

fs.writeFile("index.txt", "hello world", function (err, dataStr) {
  console.log(err); //写入成功为null，失败为错误对象
});
