<template>
  <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#1baeae">
    <van-swipe-item v-for="(item, index) in list" :key="index">
      <img :src="item.carouselUrl" alt="">
    </van-swipe-item>
  </van-swipe>
</template>

<script setup>
//接收父组件传递的数据，在js要定义props接收
defineProps({
  list: Array
})

// console.log(props.list);
</script>

<style lang="less" scoped>
.my-swipe .van-swipe-item {
  img {
    width: 100%;
    height: 100%;
  }
}
</style>