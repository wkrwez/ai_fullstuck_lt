<script setup>
import {ref} from 'vue'
defineProps([
    'todo'
])
const editing =  ref(false);
</script>

<template>
    <!-- 动态类名 不同的状态  已完成 未完成  vue编程思想 -->
  <li class="todo" :class="{completed:todo.done,editing:editing}">
    <div class="view">
        <label v-text="todo.text" @dblclick="editing=true"></label>
    </div>
    <input type="text" v-show="editing" class="edit" :value="todo.text">
  </li>
</template>

<style scoped>
</style>