import { createStore } from 'vuex'
import { getCart } from '@/api/cart.js'

const store = createStore({
  state() {  // 全局公共的数据源  === data的概念
    return {
      cartCount: 0
    }
  },
  mutations: {  // === methods  专职修改state
    setCartCount(state, count) { 
      state.cartCount = count
    }
  },
  actions: {  // === async methods  可以放异步代码  调用 mutations
    async setCartCountAction(context) {
      const { data } = await getCart()
      // console.log(data);
      context.commit('setCartCount', data.length)
    }
    
  },
  getters: { // === computed

  }
})

export default store 