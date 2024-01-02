<script setup >
import {ref} from 'vue';
import Rate from './components/Rate.vue'
const score = ref(1)
// vue开发思想是 数据与界面状态同步
const update = (num)=>{
  score.value = num
}
// 接收子组件的更新请求
</script>

<template>
  <div>
    <Rate :value="score" theme="red" @update-rate="update"/>
    <!-- <Rate :value="score" /> -->
  </div>
</template>

<style scoped>

</style>
