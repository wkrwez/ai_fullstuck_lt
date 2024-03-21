<template>
  <div>
    <Transition name="move">
      <router-view></router-view>
    </Transition>
  </div>
</template>

<script setup>

</script>

<style lang="less" scoped>
.move-enter-active,.move-leave-active{
  transition: all 0.3s ease-out ;
}

.move-enter-from,.move-leave-to{
  transform: translateX(30px);
  opacity: 1;
}
.move-enter-to,.move-leave-from{
  transform: translateX(0);
  opacity: 1;
}


</style>