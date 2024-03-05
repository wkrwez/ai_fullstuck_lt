
Person.prototype.getName = function(){
    return this.name
}
function Person(name){
    this.name = name


}
let p = new Person('tom')

// console.log(p.getName());


// 手写new
function myNew(...args){
    let obj = {}
    obj.__proto__ = args[0].prototype
    const res = args.apply(obj, args.slice(1))
    return (typeof res === 'object' && res !==null )? res : obj
}