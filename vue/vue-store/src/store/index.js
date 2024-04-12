import {createStore} from 'vuex'


const store = createStore({
    state:{
        count:0,
        todoList:[
            {id:1,name:'烟雨'},
            {id:2,name:'烟雨'},
            {id:3,name:'烟雨'},
            {id:4,name:'烟雨'},
            {id:5,name:'烟雨'},
        ]
        
    },
    getters:{
        getCount(state){
            return state.count
        },
        getId(state){
            return state.todoList.filter(item=>item.id > 2)
        }
    },
    mutations:{
        addCount(state,n){
            state.count +=n 
        }
    }

})

export default store