<template>
  <div>
    <Swiper  :list="list"/>
  </div>
</template>

<script setup>
import Swiper from './views/Swiper.vue';
import {reactive} from 'vue'
import img1 from'./assets/picture/1.jpeg'
import img2 from'./assets/picture/2.jpeg'
import img3 from'./assets/picture/3.jpeg'
import img4 from'./assets/picture/4.jpg'
import img5 from'./assets/picture/5.jpg'

const list = reactive([
  {id:1,imgUrl:img1},
  {id:2,imgUrl:img2},
  {id:3,imgUrl:img3},
  {id:4,imgUrl:img4},
  {id:5,imgUrl:img5}
])


</script>

<style lang="less" scoped>

</style>