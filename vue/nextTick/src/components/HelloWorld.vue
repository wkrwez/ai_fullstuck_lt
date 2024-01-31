<template>
  <div>
    <p ref="refP">消息：{{ msg  }}</p>
  </div>
</template>

<script setup>
import {ref} from 'vue'
const msg = ref('初始消息')

const refP = ref(null)

setTimeout(() => {
  console.log(refP.value);
}, 1000)
</script>

<style lang="scss" scoped>

</style>