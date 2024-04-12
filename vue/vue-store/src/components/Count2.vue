<template>
    <div>
        <p >{{ num }}</p>
        <button @click="add">切换</button>
    </div>
  </template>
  
  <script setup>
  import {useStore} from 'vuex'
  import {ref,computed} from 'vue'

  
  const store = useStore()
    let num = ref(0)
  
  
  const add = ()=>{
      num.value =  computed(()=> store.getters.getCount + 2)
  }
  
  </script>
  
  <style lang="less" scoped>
  
  </style>