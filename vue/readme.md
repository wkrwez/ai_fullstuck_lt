# vue3
 ## 组件
- 在要展示的父组件中引入子组件(script使用的setup)
    import  Swiper  from '文件位置'
    在html展示:<Swiper />





## 发接口请求
- 安装axios
    yarn install axios
    


import { useRequest } from 'vue-request'



## 生命周期
- onMounted()挂载后执行

# 父组件向子组件传值
1. 在父组件引入子组件
   <Swiper :绑定值="父组件变量" />
2. 在子组件中接收
  defineProps({
  绑定值: Array(类型)
  })
  在js文件需要定义props接收该函数的值

