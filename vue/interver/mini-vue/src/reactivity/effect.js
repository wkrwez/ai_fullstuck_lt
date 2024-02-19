

const targetMap = new WeakMap();
let activeEffect = null //得是一个副作用函数

//副作用函数收集器
export function effect(fn,options ={}){
    const effectFn = ()=>{
        try {
            activeEffect = effectFn  //保证activeEffect是一个函数
            return fn()
        } finally {
            activeEffect = null
        }
    }
    if (!options.lazy){ //false才会触发
        effectFn()
    }
    return effectFn
}

//为某个属性添加 effect
export function track(target,key){

    let depsMap = targetMap.get(target)
    if(!depsMap){ //初次读取到值 收集effect
        depsMap = new Map()
        targetMap.set(target,depsMap )
    }
    //是否做过依赖收集
    let deps = depsMap.get(key); 
    if(!deps){ //还未添加过effect,创建的desMap没有东西
        deps = new Set()
    }
    if(!deps.has(activeEffect) && activeEffect){
        //存入一个effect函数
        deps.add(activeEffect)
    }
    depsMap.set(key,deps)
}

//触发某个属性 effect
export function trigger(target,key){
    const depsMap = targetMap.get(target)
    if(!depsMap){ //当前对象中所有的key都没有副作用函数（从来没有使用过）
        return
    }
    const deps = depsMap.get(key)
    if(!deps){ //这个属性没有依赖
        return
    }
    deps.forEach(effectFn=>{
        effectFn()  //将该属性上的所有的副作用函数全部触发
    })
}