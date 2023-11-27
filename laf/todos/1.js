//立即执行函数
//async 函数修饰符 不让这个函数内部有异步
(async function(){
    //js是单线程语言  把异步放入event loop 
    //thenable  异步任务中控制执行顺序
//   fetch('https://yjhx77.laf.run/get-list').then(res=>
//   res.json()).then(data=>{
//   console.log(data);
//   })
//异步变同步，有利于流程控制
const res=await fetch('https://yjhx77.laf.run/get-list')
const {data}=await res.json()
console.log(data);
console.log('ok');
})()