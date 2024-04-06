// 大家最少都有一颗糖
// 从左往右遍历，比前一项大的多分糖，否则只有一颗糖
// 从右往左遍历，比后一项大的多分糖，否则只有一颗糖

var candy = function(ratings) {
    let n = ratings.length
    let leftNum = new Array(n).fill(1)
    let rightNum = new Array(n).fill(1)

    let sum = 0
    //只要比前一项大就加一，小于等于还是1颗糖
    for(let i = 1;i < n;i++){
        if(ratings[i] > ratings[i-1] ){
            leftNum[i] = leftNum[i-1] + 1
        }
       
    }
 //只要比后一项大就加一，小于等于还是1颗糖
    for(let i = n -2;i >= 0;i--){
        if(ratings[i] > ratings[i+1] ){
            rightNum[i] = rightNum[i+1] + 1
        }
        
    }
  
    for(let i = 0;i<n;i++){
        sum+=Math.max(leftNum[i],rightNum[i])
    }
    
    return sum
};

let ratings =[1,0,2]
candy(ratings)


// [1,2,3,1,1,1,1]
// [1,1,1,1,3,2,1]

// 1,2,3,4,1
// 1,1,1,2,1