<template>
    <div>
        home page
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { home } from '../api/user.js';

//每次调用接口请求需要将token传给服务端，需要封装axios
onMounted(() => {
  home()
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  })
})
</script>

<style lang="css" scoped>

</style>