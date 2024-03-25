<template>
    <div>
        <Child7>
            <template v-slot:top>
                你好
            </template>
            <template v-slot:bottom>
                hello
            </template>
        </Child7>
    </div>
</template>

<script setup>
import Child7 from '../src/components/Childer7.vue'

</script>

<style lang="scss" scoped></style>