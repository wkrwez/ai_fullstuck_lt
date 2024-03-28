1. let 和 const 声明变量：

    let 和 const 替代了 var，可以声明块级作用域的变量。

2. 箭头函数：

    使用 (params) => expression 的简洁语法定义函数。

3. 解构赋值：

    可以方便地从数组或对象中提取值并赋给变量，如 [a, b] = [1, 2]。

4. 类和继承：

    引入类的概念，使用 class 定义类，支持继承和构造函数。class constructor extends static get set
5. 模块化（Module）：

    引入 export 和 import 关键字，支持模块化编程。
6. Promise：

    引入了 Promise 对象，用于处理异步操作。
7. Map 和 Set 数据结构：

    引入了 Map 和 Set 数据结构，提供更好的数据存储和查找方式。
8. Symbol 类型：

    引入了 Symbol 类型，用于创建唯一标识符。
9. 模板字符串：

    使用反引号 `` 可以创建多行字符串，并在其中插入变量或表达式 ${variable}。
10. 默认参数值：

    在函数参数中可以设置默认值，如 function test(a = 0) { }。
11. 展开运算符（Spread Operator）：

    可以将数组或对象展开为单独的元素，如 const newArray = [...oldArray]。
12. 剩余参数（Rest Parameter）：

    可以收集剩余的参数为一个数组，如 function test(a, ...rest) { }。
13. 迭代器和生成器（Iterators 和 Generators）：

   迭代器是一种用来遍历数据集合（如数组、集合等）的接口，它提供了一种统一的方式来访问集合中的每个元素，而不需要暴露集合的内部实现。在 JavaScript 中，迭代器通常由具有 next 方法的对象表示，该方法会返回一个包含 value 和 done 属性的对象，通过不断调用 next 方法可以依次访问集合中的每个元素。

   生成器是 ES6 新增的特性，它是一种用于简化异步编程和迭代器的函数，能够在函数执行过程中暂停并保存状态，然后在需要的时候恢复执行。生成器函数使用 function* 定义，内部使用 yield 关键字来定义暂停点，通过调用生成器函数可以获得一个迭代器，通过迭代器的 next 方法可以逐步执行生成器函数中的代码，每次执行到 yield 关键字时会暂停并返回一个值。

