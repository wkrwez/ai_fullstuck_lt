<template>
  <div>
    <p>{{ state.count }}</p>
    <p>{{ num }}</p>
    <button @click="state.count++">add</button>
  </div>
</template>

<script setup>
import { reactive,computed, watch } from 'vue';

const state = reactive({
  count: 1,
  msg:2
});
// 如果这样写代码，判断是不是代理过
// const state2 = reactive(state);

const num = computed(()=>{
  return state.count * 10
})

watch(()=>state.count,
  (newVal,oldVal)=>{
    console.log(newVal,oldVal)
  }
)
</script>

<style lang="less" scoped>

</style>