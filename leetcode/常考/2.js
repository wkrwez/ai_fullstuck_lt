// 153 = 1^3 + 5^3 + 3^3  长度为3

const isTrue = (num) =>{
    
    const str = num.toString()
    const len = str.length
    let total = 0
    for(let i = 0;i<len;i++){
        total += Math.pow(str[i],len)
    }
    return num === total
}

// console.log(isTrue(371));


const getAll = (n) =>{
    let res = []
    for(let num = 10**(n-1); num < 10**n;num++){
        if(isTrue(num)){
            res.push(num)
        }
    }
return res
}

console.log(getAll(3));