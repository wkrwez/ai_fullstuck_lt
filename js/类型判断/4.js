function myInstance(left,right){
     left = left.__proto__
     right= right.prototype
    while(left !=null){
        if(left === right){
            return true
        }
        left = left.__proto__
    }
    return false

}
console.log(myInstance([],String));