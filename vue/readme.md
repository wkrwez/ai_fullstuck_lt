# vue3
- 可选链
    a?.b    可以避免undefined报错
 ## 组件
- 在要展示的父组件中引入子组件(script使用的setup)
    import  Swiper  from '文件位置'
    在html展示:<Swiper />





## 发接口请求
- 安装axios
    yarn install axios
    


import { useRequest } from 'vue-request'



## 生命周期
- onMounted() DOM挂载后执行,将要在DOM结构中渲染完成之后执行的逻辑写在里面

# 父组件向子组件传值
1. 在父组件引入子组件
   <Swiper :绑定值="父组件变量" />
2. 在子组件中接收
  defineProps({
  绑定值: Array(类型)
  })
  在js文件需要定义props接收该函数的值


# 获取DOM结构
    <template>
        <div>
            <span ref="span">123</span>  //在DOM里面声明ref
        </div>
    </template>

    <script setup>
        import {ref} from 'vue';
        const span = ref()  获取ref的值
        console.log(span);
    </script>
 - 使用ref的值需要使用span.value 


# 调用仓库store
- 先创建一个仓库store文件
    1. import {createStore} from 'vuex';
    2. export default createStore({
        state: {    //用于存储应用程序的状态数据
            loginState: false, 
        },
        mutations: {  //用于修改状态数据state
            changeLoginState(state, val) {
			state.loginState = val  //val为要修改的值
		    }
        }
    })
- 在vue文件中引入仓库store
    import { useStore } from 'vuex'
    const store = useStore()
    引入后就可以直接调用,调用state：store.state.loginState

- 调用mutations的方法
    store.commit('changeLoginState', true)  //commit用于触发 mutation 的执行

