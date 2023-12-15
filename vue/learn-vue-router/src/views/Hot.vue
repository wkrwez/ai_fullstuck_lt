<template>
    <div>
        <h2>沸点页面</h2>

        <button @click="goClassPage">去课程页面</button>
    </div>
</template>

<script>

    export default {
        methods:{
            goClassPage(){
                //三种路由跳转方式
                // this.$router.push('/class')
                // this.$router.push({path:'/class',query:{id:123}})  //多个可以用这个
                this.$router.push({name:'class',params:{id:456}})//用name跳只能用params传参
            }
        }
    }
</script>

<style lang="css" scoped>

</style>