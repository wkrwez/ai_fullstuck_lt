<template>
    <div class="child bd">
        <slot name="bottom"></slot >
        <!-- <hr/> -->
        <slot name="top"></slot>
    </div>
</template>

<script setup>

</script>

<style lang="css" scoped>
.bd{
    width: 200px;
    height: 200px;
    border: 2px solid #a5d83e;
    
}
</style>