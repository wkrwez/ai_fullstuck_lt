// function myFunction(args) {
//     console.log([...args]);
//     console.log(Object.prototype.toString.call(args));
//   }
  
//    // [1, 2, 3]
// myFunction(arguments)




// 不够优化，得记住之前计算过的
function add(a,b){
    if(arguments.length !== 2 ){
        throw new Error('传递的参数有误');
    }
    if(typeof a!=='number' || typeof b!=='number'){
        throw new Error('必须是整数');
    }
    return a + b
}
// console.log(add(1,2));
// // // 记忆函数 百搭
function memorize(f){
  if(typeof f !== 'function')return;
  var cache = {}  // 空间换时间 自由变量
  return function(){
     var key = arguments.length + 
     Array.prototype.join.call(arguments,',')
     if(key in cache){
        return cache[key]

     }else{
        return cache[key] = f.apply(this,arguments)
     }
  }
}
const memorizeAdd = memorize(add);
console.log(memorizeAdd(1,2));
console.log(memorizeAdd(1,2));
memorizeAdd(1,2)  //传到return function(){}