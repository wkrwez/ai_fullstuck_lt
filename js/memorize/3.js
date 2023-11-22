
let count = 0
var fibonacci = function(n){
    
    count++
    return n<2? n:fibonacci(n-1) + fibonacci(n-2);
}

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
fibonacci = memorize(fibonacci)
fibonacci(3000)
console.log(count);
console.time('fibonacci');
console.timeEnd('fibonacci');