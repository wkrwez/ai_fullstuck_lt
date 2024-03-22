import {createStore} from './gvuex.js'

const store = createStore({
    //写成函数函数不会污染组件对象  
    state(){
        return{
            count:1,
            todos:[]
        }
        
    },
    getters:{
        double(state) {
            return state.count * 2
        }
    },
    //修改 状态的改变可以由mutations记录
    mutations:{
        add(state){
            state.count++
        },
        addTodos(state,payload=[]){
            state.todos = [
                ...state.todos,
                ...payload
            ] //传递的参数

        }
    },
    // UI组件 + 数据管理  API请求都在找
    actions:{
        fetchTodos:async({commit})=>{
            const todos = await getTodos()
            commit()
        },
        //提交到mutations需要commit
        asyncAdd({commit}){
            setTimeout(()=>{
                commit('add')
            },1000)
        },
        add({commit}){
            commit('add')
        }
    }

})


export default store