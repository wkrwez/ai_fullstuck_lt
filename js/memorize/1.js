function add(a,b){

console.log(Array.prototype.join.call(arguments, '-'));


    // console.log([...arguments]);
    // const arr = Array.from(arguments)    将类数组转变为数组
    //  console.log(Object.prototype.toString.call(arguments));
    //参数的数量？ this  同一级的arguments
    // console.log(a,b,arguments[0],arguments[1]);
    // console.log(typeof arguments,Object.prototype.toString.call(arguments),'111');
    // console.log(arguments.join('--'));
    if(arguments.length !=2){
       throw new Error('必须传递两个参数')  //超过两个参数就报错 throw Error
    }
    c=a+b
    return c
}
try{
    console.log(add(1,2));
}catch(e){
    console.log(e);
}
console.log('continue....');

