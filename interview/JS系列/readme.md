# 1.js 数组上面有哪些方法？

1.增：push unshift splice concat 2.删：pop shift splice slice 3.改：reverse sort 4.查：indexOf lastIndexOf filter find includes  
5.转换：join 6.迭代：forEach map reduce filter set
7.Array.from()

# 2.js 字符串上有哪些方法？

1.增：concat 2.删:slice substring substr 3.改：replace trim padStart padEnd trimStart trimEnd toupCase(将字串大写) toLowerCase(将字串小写) 4.查：indexOf lastIndexOf includes startsWith endsWith 5.转换：split

# 3.谈谈 js 当中的类型转换机制

- 是什么：
  js 中有原始类型和引用类型：
- 原始类型：number string boolean symbol null undefined Bigint
- 引用类型：Object Function Array Date RegExp Map Set WeakMap WeakSet

有无迭代器（Symbol.iterator）

- 可迭代：Array,Map,Set
- 不可迭代：WeakMap WeakSet, Object

## == 转换规则

从上到下按规则比较

1. 两端只要一端存在 NaN，返回 false
2. undefined 和 null 与自身或相互比较为 true，和其它原始类型都为 false
3. 两端类型相同比较值
4. 两端都是原始类型，转换为数字比较，对象类型转换为原始类型。

对象如何转原始？hint= default|string|number,没有明确转换为某个类型时为 default

1. 对象拥有[Symbol.toPrimitive]时，调用方法转原始，得不到原始值抛出异常
   //主要为了自定义对象能够拥有隐式转换的能力[Symbol.toPrimitive]，需要显示自定义，继承与某个对象（Date）
2. 调用 valueOf 方法，得不到下一步。
3. 调用 toString()方法，得不到原始值抛出异常

## 类型不一致

- NaN 和任何类型包括自己都是 false，[] == [] 会判断引用地址不一致

### 两种类型

- 类型不一致的前提
  - 都是原始类型会转数字比较
  - 有一端出现基本类型，会转原始
    首先找 Symbol.toPrimitivel 可以直接转原始。
    再调用.valueOf()
    不行再调用.toString()
    最后转数字比较

通常开发过程中，会用到一些显示的类型转换的手段来完成逻辑开发
.....

在 v8 执行的过程当中还存在另一种类型转换 --- 隐式类型转换
通常发生在 比较运算符 和算数运算符

- 比较运算符： == === != !== < <= > >= if while

- 算术运算符： + - \* / %

[]==![]  
这个涉及到隐式转换的问题，提到这个问题的，我们需要了解一个东西，那就是由复杂数据类型转换为基本数据类型。将引用类型转换为原始类型,在拆箱过程中会遵循 ECMAScript 规定的 toPrimitive 原则,对引用类型进行转换。在 js 中将复杂数据类型转换为基本数据类型会自动调用 toPromitive 函数。由于！号的优先级更高，先按照逻辑转换将![]转化为 false,一边为基本数据类型一边为引用数据类型的话，就把引用数据类型转换为基本数据类型空字符串。

[] == !true
[] == false
'' == false
0 == 0

# 4. == 和 === 的区别？

1. == 是比较两个值，类型不一样会进行隐式转换，=== 是比较两个值的类型和值。

# 5.深浅拷贝的区别？如何实现一个深拷贝？

1. 深浅拷贝通常只针对于引用类型

- 浅拷贝：
  只拷贝一层对象，复制这一层对象的原始值，如果有引用类型的话，就复制它的指针。

  1. object.assign()
  2. concat()
  3. 数组解构

- 深拷贝：
  层层拷贝，所有类型的属性值都会被复制，原对象的修改不会影响拷贝后的对象。
  1. JSON.parse(JSON.stringify(obj)) ----无法处理 undefined 和 symbol，funnction，循环引用
  2. structuredClone() symbol，funnction
  3. 能处理循环引用

## JSON.parse 是 JavaScript 中的一个内置方法，用于将 JSON 字符串解析为 JavaScript 对象。

JSON（JavaScript Object Notation）是一种用于数据交换的轻量级数据格式。

- 构成

1. 键/值对的集合，类似于 JavaScript 对象。
2. 有序列表，类似于 JavaScript 数组。
   JSON.parse()方法接受一个 JSON 格式的字符串作为参数，并将其解析为对应的 JavaScript 对象。如果提供的字符串不是有效的 JSON 格式，则会抛出一个 SyntaxError 异常。

## JSON.stringify() 是 JavaScript 中的一个内置方法，用于将 JavaScript 对象或数组转换为 JSON 字符串。

- 构成

1. 键/值对的集合，类似于 JavaScript 对象。
2. 有序列表，类似于 JavaScript 数组。
   JSON.stringify() 方法接受一个 JavaScript 对象或数组作为参数，并将其转换为对应的 JSON 字符串。如果提供的对象包含函数、undefined 或 symbol 属性，则在转换过程中会自动将其忽略。如果对象包含 Date 对象，则会自动将其转换为字符串。如果对象包含循环引用（即对象之间相互引用），则会在转换过程中抛出一个 TypeError 异常。

# 6.说说你对闭包的理解？

- 是什么：
  当一个函数中的内部函数被拿到函数外部调用，又因为在 js 中内层作用域总是能访问外层作用域，那么内部函数存在对外部函数中变量的引用，这些变量的集合称之为闭包。

- 使用场景：

1. 创建私有变量 （全局变量不易维护）
2. 延长变量的生命周期
3. 实现颗粒化（柯里化）
4. 弹出框，防抖节流

- 缺点：
  会造成内存泄漏，内存被占据

- 两个变量去调用同一个函数，会创建两个闭包

# 7.什么是柯里化？

- 是什么：
  将一个接收多个参数的函数转变成多个只接受一个参数的函数
- function curry(fn) {
  let foo = (...args) => {
  if (args.length == fn.length) return fn(...args);

      return (...arg) => foo(...args, ...arg);

  };
  }

# 8.说说你对作用域的理解？

- 是什么：
  变量和函数能够生效的区域，这个区域叫作用域。

- 作用域的划分：

1. 全局作用域
2. 函数作用域
3. 块级作用域（const||let 和{}）

- 作用域链
  作用域只能从内到外的访问，这种访问规则形成的链状关系我们称之为作用域链

- 词法作用域
  指的是函数或者变量定义的区域

# 9.说说你对原型的理解

- 是什么
  显式原型指的是函数身上自带的 prototype 属性，通常可以将一些方法和属性添加到到显示原型上，这样所有的实例对象都可以共享这些方法和属性。

  隐式原型：**proto**是对象这种结构上的一个属性，其中包含了创建该对象时，隐式继承到的属性

- 原型链：
  创建一个实例对象时，实例对象的隐式原型 === 创建该对象的构造函数的显示原型，在 js 中对象的查找规则是先在对象中查找，找不到再去对象的隐式原型上查找，顺着隐式原型一层层往上找，直到找到 null。

- 可用来实现属性的继承

# 10. 说说 js 中的继承

- 是什么：
  在 js 中，让一个子类可以访问父类的属性和方法

- 继承有哪些方式：

1. 原型链继承(1.无法给父类灵活传参，2.多个实例对象共用同一个原型对象会存在属性相互影响 push 会修改)
2. 构造函数继承：（1.只能继承到父类身上的属性，无法继承到父类原型上的属性）
3. 组合继承（经典继承）：存在多次父类函数的调用，多造成了性能的开销
4. 原型式继承：（1.因为是浅拷贝，父类中的引用类型在子类之间共用，所以会相互影响 2.子类无法添加默认属性）
5. 寄生式继承：（1.同上）
6. 寄生组合式继承：（1.同上）
7. class 继承：（）

# 11. 说说 js 中的 this

- 是什么：
  this 是函数在运行过程中自动生成的一个对象，用来代指作用域的指向。

- 绑定规则

  1. 默认绑定：当函数被独立调用时，函数的 this 指向 window。(函数的词法作用域在哪里，this 就指向哪个词法作用域，一层层往上找，直到找到最外层。)
  2. 隐式绑定：当函数被一个对象所调用时，函数的 this 指向这个对象。
  3. 隐式丢失：当函数调用前有多个对象，函数的 this 指向最近的对象。
  4. 显式绑定：call,apply,bind。
  5. new 绑定：this 指向实例对象。

- 箭头函数
  箭头函数中的 this 是它外层非箭头函数的，指向也按照上述的绑定规则。

# 12.new 的实现原理

1. 创建一个空对象
2. 将构造函数的原型绑定到对象的原型上
3. 将构造函数的 this 显式指向对象
4. 判断构造函数的返回值是否是引用类型，是就返回，不是就返回对象

- 构造函数有返回值，且为引用类型时会覆盖 new 当中的返回值

# 13. call,apply,bind 原理和区别

call：零散传参 call(obj,1,2)
apply：数组传参
bind：零散传参，还会返回一个函数，需要调用这个函数，参数可以写在这个函数里面

# 14.说说 js 中的事件模型

- 是什么
  捕获，目标，冒泡三个阶段
- 分类

1. DOM0 级：onclick（无法控制事件在捕获冒泡哪个阶段执行）
2. DOM1 级：addeventListen（可以控制事件执行在哪个阶段）
3. IE 模型：attachEvent（无法控制事件在捕获冒泡哪个阶段执行）

# 15.说说 typeof 和 instanceof 的区别？

- typeof
  能判断除了 null 之外的所有原始类型

- instanceof
  会检查原型链，只能检查是否是特殊类或者构造函数创建的实例，不能检查原始类型和自定义的原始构造函数
- Object.prototype.toString.call(x)

  1. [].toString() 数组版本的 toString
  2. Object.prototype.toString.call([])
  3. [].toString() 对象版本的 toString

  该方法会让变量 x 调用对象上的 toString 函数，而 toString 返回值为[object Object]类型

- Array.isArray()

# 16. 说说 Ajax 的原理

- 是什么
  Ajax

- 实现过程
  1. 创建一个 XHR 实例对象
  2. 调用实例对象中的 open 方法与服务器建立连接
  3. 调用实例对象的 send 方法发送请求
  4. 监听 onreadystatechange 事件，通过判断 readyState 的值来获取到最终数据
  5. 将数据更新到页面

# 17. 怎么实现上拉加载下拉刷新？

1. 监听 touchstart touchmove touchend 事件，记录手指移动的距离，大于临界值时实现刷新操作，其中使用了 transform：translateY 来添加各处动画
2. 根据手指滑动的方向和容器顶部或底部到屏幕的距离来确定此时该执行上拉加载更多 还是

# 18.防抖节流

# 19. 事件代理

- 事件委托 （多个子容器需要绑定相同的事件）

# 20. 说说 js 当中的事件循环

- 是什么：
  JS 引擎在执行 js 过程中会区分同步和异步代码，先执行同步再执行异步，异步中同样先执行同步，再执行异步，以此往复的循环。

- 异步

  1. 宏任务：script、setTimeout、setInterval、setImmediate、I/O、UI-rendering、postMassage()、 MessageChannel
  2. 微任务：.then() nextTick(node) MutationObserver 回调

- Event Loop：

1. 执行同步代码 （也叫宏任务）
2. 执行微任务（完毕）
3. 有需要的话就渲染页面
4. 执行宏任务（下一次事件循环的开始）

# let const var 区别

const 不能修改变量，let 和 var 可以

全局 let\const 会挂在到 script 作用域

var 可以重复声明变量，let 和 const 不行

var 声明的变量会添加到 window 上，声明提升到当前作用域顶端，声明提升但是初始化(赋值)不会提升，函数提升的优先级大于变量

let 和 const 会形成暂时性死区，在块级作用域中，在声明变量之前访问该变量会导致引用错误

# 包装类

原始类型不能具有属性和方法
let a = 1
a.name = 123
console.log(a.name) //undefined v8 开始会把 a 当成字符串对象，当读到定义的 a 后又会删除

let s = 'asdfa'相当于 new String('asdfa')

let s = new String('asdad')可以添加属性

# 空数组怎么判断

类型转换
let arr = []

- !arr.length
  这是判断布尔值，如果长度为 0 就是!0,!会导致转换为 true
  如果!2 就为 false

# 空对象判断

- Reflect.ownKeys 以数组的形式返回对象的键；
- Object.getOwnPropertyNames 以数组的形式返回对象的键；Symbol 无法处理
- for in 循环，不处理 Symbol
- Object.keys ;以数组的形式返回对象的键；Symbol 无法处理
- Object.values;以数组的形式返回对象的值；Symbol 无法处理
- 判断是否存在 Symbol 键值对
  - Object.getOwnPropertySymbols

# 21.forEach 怎么跳出

1. 抛出异常
