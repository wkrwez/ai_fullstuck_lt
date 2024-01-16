<template>
  <div class="simple-header">
    <van-icon name="arrow-left" v-if="back" @click="goBack"/>
    <i v-else>&nbsp;</i>
    <div class="simple-header-name">{{title}}</div>
    <van-icon name="ellipsis" />
  </div>
  <div class="block">
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
defineProps({
  title: String,
  back: {
    type: Boolean,
    default: true
  }
})

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>

<style lang="less" scoped>
.simple-header{
  display: flex;
  font-size: 18px;
  height: 44px;
  align-items: center;//在弹性容器子元素在y轴居中
  justify-content: space-between;
  padding: 0 10px;
  border-bottom: 1px solid #ebedf0;
   //固定定位
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  //消除内边距超出
  box-sizing: border-box;
  z-index: 999;
  background-color: #fff;
}
.block{
  height: 44px;
}
</style>