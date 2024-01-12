import {createStore} from 'vuex'
import {getCart} from "@/api/cart.js"

const store = createStore({
    state(){    //全局公共的数据源 ===data的概念
        return{
            cartCount:1
        }
    },
    mutations:{ //修改state数据 ===methods
        setCartCount(state,count){   //state是源码默认的，传参直接传给第二个
            state.cartCount = count
       }
    },
    actions:{ //异步操作 ===async methods  可以放异步代码  调用mutations方法
        async setCartCountAction(context){
            const {data}= await getCart()
            console.log(data);
            context.commit('setCartCount',data.length)  //mutations里面的拿到actions

        }
    },
    getters:{ //计算属性 ===computed methods
       
    }
})

export default store