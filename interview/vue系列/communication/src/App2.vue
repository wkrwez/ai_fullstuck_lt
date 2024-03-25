<template>

<Childer @add="handle"/>
<div class="bd">
  <ul>
    <li v-for="item in list">{{ item }}</li>
  </ul>
</div>


</template>

<script setup>
import {ref} from 'vue'
import Childer from './components/Childer2.vue'
const list = ref(['html','css'])

const msg = ref('')

const handle = (e)=>{
    console.log(e);
    list.value.push(e)
}
</script>

<style scoped>

</style>
