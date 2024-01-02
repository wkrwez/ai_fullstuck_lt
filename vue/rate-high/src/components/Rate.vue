<template>
    <!-- 样式文本 key:val; -->
    <div :style="fontStyle">
        <div class="rate" @mouseOut="mouseOut">
            <span v-for="num in 5" :key="num" @mouseover="mouseOver(num)">☆</span>
            <span class="hollow" :style="fontWidth">
                <span v-for="num in 5" :key="num" @click="onRate(num)">★</span>
            </span>
        </div>
    </div>
</template>

<script setup>
// 交接一下
import { ref, defineProps, computed,defineEmits } from 'vue'
// 自已的分值响应式变量

// 主题配置
const themeObj = {
    black: '#000',
    orange: '#fa5413',
    green: '#73d13d',
    blue: '#40a9ff',
    red: '#f5222d'
}
const props = defineProps({
    value: Number,
    theme: {
        type: String,
        default: 'orange',
    }
})
const emits = defineEmits(['update-rate'])
// UI状态  动态的
let width = ref(props.value)

let rate = computed(() => "★★★★★☆☆☆☆☆".slice(5 - props.value,
    10 - props.value))

let fontStyle = computed(() => `color:${themeObj[props.theme]}`)
let fontWidth = computed(() => `width:${width.value}em`)
// 1. 定义一个 props
// 2. 定义一个默认值
// 3. 定义一个类型
// 4. 定义一个是否必填
// 5. 定义一个是否是只读
const mouseOver = (i) => {
    width.value = i
}

const mouseOut= () => {
    width.value = props.value
}

const onRate=()=>{
    //数据和状态的统一
    emits('update-rate',num)
}

</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
}

.rate {
    position: relative;
    display: inline-block;
    font-size: 0px;
}

.rate span {
    font-size: 16px;
}

.rate>span.hollow {
    position: absolute;
    display: inline-block;
    top: 0;
    left: 0;
    width: 0;
    overflow: hidden;
}</style>