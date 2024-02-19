import {track,trigger } from './effect.js'



//把get 和 set 单独拿出来写
const get = createGetter();
function createGetter(){
    return function get(target,key,receiver){
        console.log('读取');
        const res = Reflect.get(target,key,receiver)//target[key]

        // 依赖收集
        // 在set之前收集这个属性究竟还有哪些地方用到了(副作用函数的收集)
        // 放到get里面可以不用收集没有使用的属性，get只读取使用的属性
        track(target,key)

        return res
    }
}

const set = createSetter();
function createSetter(){
    return function set(target,key,value,receiver) {
        console.log('更新',key,value);
        const res = Reflect.set(target,key,value,receiver) // target[key] = value
        
        //记录此时是哪个key值变更，再去通知依赖该值的函数生效   更新浏览器的视图
        //触发被修改的属性身上添加副（附加 watch，computed）作用函数   触发收集（被修改的key在哪些地方用到了）发布订阅
        trigger(target,key)
        return res
    }
}

export const mutableHandlers = {
    get,
    set
        //更新浏览器的视图
    }
