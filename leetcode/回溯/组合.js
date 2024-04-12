var combine = function(n, k) {
    let arr = []
    function back(res,startIndex){
        if(res.length === k){
            arr.push(res.slice(0))
            return
        }

        for(let i = startIndex ;i<=n -(k-res.length)+1;i++){
            res.push(i)
            back(res,i+1)
            res.pop()
            
        }
    }
    back([],1)
    return arr
    
};

console.log(combine(6,3));