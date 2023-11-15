//递归

// 5!  120
function mul(n){
//     let res=1   第一种
//     for(var i=1;i<=n;i++){
//         res = res*i
//     }
//    return res
 
   //要当心爆栈
    if(n==1){return 1}//当代码执行到n=1就会返回一个1，一层一层回到n=5
    
   return n*mul(n-1) //5*mul(4)
     
    


}
mul(5)
console.log(mul(5));

// mul(5)==5*mul(4)
// mul(4)==4*mul(3)
// mul(3)==3*mul(2)
// mul(2)==2*mul(1)
// mul(1)==1
//找规律  找出口