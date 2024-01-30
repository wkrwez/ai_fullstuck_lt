<template>
    <div>
      <p>home page</p>
      <Hello />
    </div>
  </template>
  
  <script setup>
  import Hello from '../components/Hello.vue'
  import { onMounted, onActivated, onDeactivated, onBeforeMount, onUnmounted } from 'vue';
  
  onBeforeMount(() => {
    console.log('首页的onBeforeMount');
  })
  onMounted(() => {
    console.log('首页的onMounted');
  })
  onUnmounted(() => {
    console.log('首页的卸载');
  })
  
  
  onActivated(() => {  // 当被缓存的组件再次生效时触发
    console.log('首页生效');
  })
  onDeactivated(() => { // 当组件被缓存起来时触发
    console.log('首页被缓存');
  })
  </script>
  
  <style lang="css" scoped>
  
  </style>