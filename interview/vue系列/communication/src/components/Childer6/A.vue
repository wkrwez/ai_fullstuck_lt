<template>
    <div>
        <input type="text" v-model="msg">
        <button @click="add"></button>
    </div>
</template>

<script setup>
import emitter from './emit'
import {ref} from 'vue'

const list = ref(['html','css'])
const msg = ref('')

const add = ()=>{
    list.value.push(msg.value)
    emitter.emit('list',list.value)
}

</script>

<style lang="css" scoped>

</style>