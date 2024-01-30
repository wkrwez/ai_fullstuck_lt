<template>
    <component :is="component"></component>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useRouter } from '../myRouter/index.js'
  
  const router = useRouter() // 在当前组件注入了router
  
  
  const component = computed(() => {
   
    // 如果当前的url是'/'，就返回Home.vue
    const route = router.routes.find((route) => {
      return route.path === router.current.value
    })
    console.log(route.component);
    
    // if (typeof(route.component) === 'function') {
    //   console.log(route.component());
    //   return route ? route.component() : null
    // }
    return route ? route.component : null
  })
  </script>