var coinChange = function(coins, amount) {
      const f=[]
      f[0]=0
      for(let i=1;i<=amount;i++){
        //f[i]
        f[i]=Infinity;  //先设置成最大值    
        for(let j=0 ;j<coins.length;j++){
            if(i - coins[j]>=0){
                f[i]=Math.min(f[i],f[i - coins[j]]+1)
            }
        }
      }
      if(f[amount]===Infinity){
        return -1
      }
      return f[amount]
};
console.log(coinChange([1,2,5],11));

/* 
i=1  f[1]=Math.min(Infinity,1)        f[1]=1
i=2  j=0 f[2]=Math.min(Infinity,2)     f[2]=2
     j=1 f[2]=Math.min(f[2]=2,1)       f[2]=1   f[2]取最小值
i=3  j=0 f[3]=Math.min( Infinity,2)      f[3]=2
i=3  j=1 f[3]=Math.min( f[3]=2,2)   f[3]=  2
*/
