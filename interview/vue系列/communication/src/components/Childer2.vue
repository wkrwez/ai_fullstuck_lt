<template>
    <div>
        <div class="hd">
            <input type="text" v-model="msg">
            <button @click="add">添加</button>
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue'
const msg = ref('')

const emits = defineEmits(['add']) //凭空创建一个事件

const add = ()=>{
    emits('add',msg.value) //发布add事件
}
</script>

<style lang="css" scoped>

.hd{
  input{
    width: 200px;
    padding: 10px 0;
    font-size: 20px;
  }
}
</style>