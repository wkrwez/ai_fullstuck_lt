function fn(n){
    let res = [1,1]
    
    for(let i = 2;i<n;i++){
        res[i] = res[i-1] + res[i-2]
    }
    return res[n-1]
}
console.log(fn(10));

//移到dp题   72