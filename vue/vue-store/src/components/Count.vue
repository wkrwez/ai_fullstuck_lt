<template>
    <div>
        <button @click="add">{{ store.state.count }}</button>
    </div>
  </template>
  
  <script setup>
  import {useStore} from 'vuex'
  import {ref,computed} from 'vue'
  let len = ref(0)
  
  const store = useStore()
  
  const num = computed(()=>{return store.commit('addCount',10)})
  
  const add = ()=>{
    store.commit('addCount',10)
  }
  
  </script>
  
  <style lang="less" scoped>
  
  </style>