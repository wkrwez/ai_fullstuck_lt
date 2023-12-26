<script setup>
import {defineProps, computed} from 'vue';
// 父子组件信任通信
// 外界传输的参数对象
 let props=defineProps({
    value:Number,
    theme:{
        type:String,
        default:'orange'
    }
})
// 计算属性，data/props 再计算一下 总价
let rate = computed(()=>"★★★★★☆☆☆☆☆".slice(5-props.value,10-props.value))
let fontStyle = computed(()=>`color:${props.theme};`)
</script>

<template>
<div :style="fontStyle">Rate{{rate}}</div>
</template>

<style scoped>
</style>