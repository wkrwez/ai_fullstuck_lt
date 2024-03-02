<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <!--
   异步组件    没有加载出来之前
   懒加载 页面组件加载出来之前  显示点loading... -->
 <Suspense>
    <router-view />
      <template #fallback>
         Loading...
      </template>   
 </Suspense>
</template>

<style scoped>

</style>
