<script setup>
// vue 主要工作开发组件
// 响应式思想
// vue3语法  ref响应式
import {ref} from 'vue';  //分数变了自动更新
// 组件化思想
import Rate from './components/Rate.vue'
let score = ref(3) //data
setTimeout(()=>{
  // 组件 = UI + 数据状态
  //状态的改变
  score.value = 4
},2000)
</script>

<template>
<!--   评分，五颗星星，点亮 组件思维-->
<Rate :value="score" />
<Rate :value="score" theme="red" />
</template>

<style scoped>

</style>
