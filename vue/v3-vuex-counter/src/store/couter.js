// 数据要共享，store
// store 仓库，
// 组件    小卖铺里的货架
// 进货
import {defineStore} from 'useTodoStore'
import {ref,computed} from 'vue'
//vue3 hooks 编程
export const useCounterStore = defineStore('counter',()=>{
    const count = ref(0);
    return{
        count 
    }
})