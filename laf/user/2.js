//到底做了什么？函数放到event loop中

setTimeout(function(){
    console.log('1000ms以后');
},1000)
const p =new Promise((resolve,reject)=>{
    console.log('实例化promise');
    //异步任务
    setTimeout(()=>{
      console.log('定时器运行');
      resolve()  //确认执行成功了  调用resolve函数就可以运行p.then
    },1000)
})
// console.log(p.__proto__);
p.then(function(){
    console.log('1000ms以后,hello');
    
})
// console.log('hello');
