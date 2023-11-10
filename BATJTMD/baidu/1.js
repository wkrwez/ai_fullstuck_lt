// es6 类
//类和对象有什么区别？  类是抽象的，定制，对象是具体的
// 类可以实例化多次
//对象是具体的
class SingleDog{
    constructor(){

    }
    //属于类上的方法
    static getInstance(){
    // console.log('类的方法');
    //返回实例
    if(!SingleDog.instance){
        //仅实例化一次
        SingleDog.instance = new SingleDog()
    }

    }
    //公有方法  属于实例上的
    show(){
        console.log('单身贵族');
    }
}
// 设计模式，一个类只实例化一次   封装
// 第一次new，不实例化，直接返回实例
// new  角度，搞不定？  &{}
// 总领导  弹窗
const s1 = new SingleDog() //生成对象 -> 拿到对象
const s2 = new SingleDog()
//如何让他们相等
console.log(s1 ===s2);        //false  内存中不一样
console.log(SingleDog.getInstance());