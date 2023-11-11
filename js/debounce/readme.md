# JS 八股文之防抖节流

## 前端“三清”
 - window
   BOM浏览器对象  负责body之外的浏览器功能
- document
   DOM  js会跟DOM“交流”
- Object
   JS的顶层对象
   new Object（）   {}简写
   wan._proto_(私有属性,原型) ->Object  -> null
-  JS类
   - 大写的函数作为构造函数
     new + this 完成由{}空对象到构造完成的过程
     对象就有属性了
   - 对象的方法呢？
      构造函数的prototype上
      wanwan和Person没有血缘关系，女娲造人？
      构造的过程 new Person  {} Object 空对象
      Person.prototype  {}
- Person.prototype 原型
- Object.prototype 原型
- wanwan.__proto__.__proto__.__proto__原型链
- 原型的哪一栈上有的方法，对象都可以用
- JS面向对象不是血缘，而是面向原型的
- 函数，在运行的那一瞬间，this的值就被决定了
   this 由函数的运行方式决定  事件的处理函数，this指向事件发生的元素本身
- this是什么？
   - 指针  函数的需要
   - 定义的时候和执行的时候
   - 函数运行的时候被决定
       运行时以不同的方式来运行，值  不一样
   - 有规矩
       - 普通函数运行  this 指向window顶级，没必要指的 不需要this
       - 事件的处理函数运行，this指向事件发生的元素
       - 函数作为对象的方法被调用 this指向对象本身
       - 函数以构造函数的方式运行 this指向实例