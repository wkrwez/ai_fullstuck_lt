<template>
    <Childer v-model:list="list" />
    <div class="bd">
        <ul>
            <li v-for="item in list">{{ item }}</li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Childer from './components/Childer3.vue'
const list = ref(['html', 'css'])

const msg = ref('')


</script>

<style scoped>

</style>