import {mutableHandlers} from './baseHandlers.js' 

// 存储响应式对象 
export const reactiveMap = new WeakMap() //对内存的回收更加友好

// 将target变成响应式
export function reactive(target){//target是引用类型
   return createReactiveObject(target,reactiveMap,mutableHandlers)
}



// 创建响应式函数
export function createReactiveObject(target,proxyMap,proxyHandlers) {
    // 判断target是不是一个引用类型,不是对象就退出
    if  (typeof target !== 'object' ||  target === null) {
        return target
    }

    // 该对象是否已经被代理过(已经是响应对象)
    const existingProxy = proxyMap.get(target)
    if (existingProxy) {
        return existingProxy
    }

    // 执行代理操作(将target处理成响应式)  Proxy不支持原始类型
    const proxy =  new Proxy(target,proxyHandlers) //第二个参数的作用：当target被读取值，设置值等操作会触发的函数

    // 往proxyMap 增加 proxy,把已经代理过的对象缓存起来
    proxyMap.set(target,proxy)
    return proxy
}