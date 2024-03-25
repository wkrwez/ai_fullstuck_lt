<template>
    <Childer ref="childRef" />
    <div class="bd">
        <ul>
            <li v-for="item in childRef?.list">{{ item }}</li>
        </ul>
    </div>
</template>

<script setup>
import { ref,onMounted,onBeforeMount } from 'vue'
import Childer from './components/Childer4.vue'


const msg = ref('')

const childRef = ref(null)



onMounted(()=>{
    console.log(childRef.value);
})

</script>

<style scoped>

</style>