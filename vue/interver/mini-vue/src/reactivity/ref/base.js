let obj ={
    name:'Tom',
    get age(){
        return 18
    },
    set age(newVal){
        console.log(newVal);
    }
}

// console.log(obj.age());//获取函数的返回值,当成函数使用

// console.log(obj.age);//js中的对象有getter和setter的能力,当成属性使用
obj.age = 19