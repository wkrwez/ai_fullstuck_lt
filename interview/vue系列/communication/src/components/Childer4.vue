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

const list = ref(['html', 'css'])

const msg = ref('')

const add = () =>{
    list.value.push(msg.value)
}

defineExpose({list})   //子组件愿意暴露出来的变量
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