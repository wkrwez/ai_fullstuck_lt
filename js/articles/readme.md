- 函数式编程
   - sort 函数，操作有副作用，影响原数组
   - sortArr函数，修改外界闯进来的实参nums，多人协作时可能会带来外界的误解。在编写函数时，不要写这种函数，我们要写纯函数


- 写函数前,cover 覆盖99%的case
- 浅拷贝
    数组是对象,引用式赋值[//    const res = arr 
    //    return res.sort()    //同一个地址，引用式赋值，return res.sort()还是改变了原数组]
    arr.concat()返回的是全新数组

- 数组渲染ul列表
   document.querySelector('#bands').innerHTML =['asdasd','asdadad'].map(function(item){  console.log(item);return `<li> ${item} </li>`;}).join('')
    - 使用map,将原来的数据数组变成li 字符串数组
       es6 数组的新方法,不影响原来数组,返回全新
       遍历数组的每一项,执行callback,callback返回值就是新数组每一项的值
    - join('') li的拼接字符串
    - innerHTML = 
   
     