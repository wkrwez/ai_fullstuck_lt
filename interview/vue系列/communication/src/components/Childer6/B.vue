<template>
    <div>

    </div>
</template>

<script setup>
import emitter from './emit'
import {ref} from 'vue'


emitter.on('list',()=>{
    console.log(e);
})
</script>

<style lang="css" scoped>

</style>