# 两数相加
- 伪数组(arguments)
    Object.prototype.toString.call()   返回值'[object xxx]'
    有length属性，用下标访问 但是不是真正的数组，没有join等方法
    永久
    - Array.from(arguments)
    - [...arguments]
    临时
    Array.prototype.join.call(arguments,'--')

- 永远不要相信用户，要校验参数，代码一定要健壮
- var obj = {a:1}
    内存怎么存的？头部前三位表示数据类型 000  二进制
    null 开头也是000

- 递归
   - 自顶而下解决问题
      不停的函数入函数执行栈解决问题
   - 重复计算
      memorize
    - 不能被允许的问题
    - js优点
       cache就不用在全局了，因为有闭包