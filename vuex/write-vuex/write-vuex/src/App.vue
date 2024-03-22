<script setup>
import HelloWorld from './components/HelloWorld.vue'
import {useStore} from './store/gvuex.js'
import {computed} from 'vue'

const count = computed (()=> store.state.count)
const store = useStore()
const double = computed(()=>store.getters.double)

const add = ()=>{
  store.dispatch('add')
}

const asyncAdd = ()=>{
  store.dispatch('asyncAdd')
}
</script>

<template>
  <div>
    {{ count }} *2={{ double }}
    <button @click="add">add</button>
    <button @click="asyncAdd">add</button>
  </div>
</template>

<style scoped>

</style>
