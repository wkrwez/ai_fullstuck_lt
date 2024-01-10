import {defineStore} from 'pinia'
import {ref,computed} from 'vue'
//vue3 hooks 编程
export const useTodoList = defineStore('todos',()=>{
    const todos = ref([{text:'学习',done:true}]);
    return{
        todos
    }
})