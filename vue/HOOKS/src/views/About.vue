<template>
    <div>
      about page
      <Hello />
  
    </div>
  </template>
  
  <script setup>
  import { onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router'
  import Hello from '../components/Hello.vue'
  import { onMounted } from 'vue';
  

  //离开页面
  // onBeforeRouteLeave((to, from, next) => {
  //   console.log(to, from);
  //   const flag = window.confirm('你确定要离开这个页面吗？')
  //   if (flag) {
  //     next()
  //   }
  // })
  
  onMounted(() => {
    console.log('关于页面的onMounted');
  })
  </script>
  
  <style lang="css" scoped>
  
  </style>