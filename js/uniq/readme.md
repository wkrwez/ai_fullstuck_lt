# leetcode等良好编程素养

## 模块化（包）  代码要写的模块化
    从业务中抽离，放到相应的模块中去   1.js
- 一个文件一个类
- 一个文件一些功能函数
- 一个函数只完成一个功能，如果功能复杂，分成多个函数
- 我们使用了node.js的commonjs模块化机制
      model.exports = 输出对象
      require 


## 算法思想
- 暴力破解能快速解决问题，只是好想，执行太慢
     leetcode起始点是规避暴力法

- 缓存数组的长度
- O(n^2)->O(nlogn)->O(n)
- 数组方法，有哪一种可以去除一层循环          第二个
    arr.indexOf(1)>=0说明存在

- indexOf 更好地提供了去重功能，代码更优雅
    需要arr.indexOf 的支持

- 为false的判断
    - 0 ''  false  undefined  null  NaN
   ![]()

- 先排序，当前项是否和前一项一样？          第三个
