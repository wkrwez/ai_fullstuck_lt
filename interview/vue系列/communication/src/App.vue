<script setup>
import {ref} from 'vue'
import Childer from './components/Childer.vue'
const list = ref(['html','css'])

const msg = ref('')
const add = ()=>{
  list.value.push(msg.value)
}
</script>

<template>
<div class="hd">
  <input type="text" v-model="msg">
  <button @click="add" >添加</button>
</div>

<div class="bd">
  <ul>
    <li v-for="item in list">{{ item }}</li>
  </ul>
</div>

<Childer :list="list"/>
</template>

<style scoped>
.hd{
  input{
    width: 200px;
    padding: 10px 0;
    font-size: 20px;
  }
}
</style>
