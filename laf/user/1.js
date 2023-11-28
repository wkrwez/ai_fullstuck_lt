function sleep(t){
    const p =new Promise(resolve=>{
        setTimeout(()=>{
            resolve('promise返回的hello world')
        },t)
         
    })
  
    return p
  
}
//同步通过promise的then变成了同步
sleep(1000)
.then((msg)=>{
    console.log(msg,'------');
})
// 函数返回promise
//then里面



(async function(){
    //耗时任务 promise的实例
    const res= await fetch('https://qhabzb.laf.run/get-list')
    const data=await res.json()
//   .then(res=>res.json())  //没有ansyc（await配套使用）时就是使用这个，但是会异步
//   .then(data=>{
    console.log(data);         //代码前有两个注释是因为后面注释的
//   })
})()