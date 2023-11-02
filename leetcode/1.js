//递归
//自顶向下
//每个问题都相同
//退出条件
var climbStairs = function(n) {
   if(n===1)return 1;
   if(n===2)return 2;
   return climbStairs(n-1) + climbStairs(n-2);
   
};
// 结果瞬间占满整个函数栈，最多n=45
console.log(climbStairs(10));