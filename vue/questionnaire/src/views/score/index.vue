<template>
    <div>
        <h2 >当前的分：{{ score }}</h2>
    </div>
</template>

<script>
    import { mapState ,mapGetters} from 'vuex';
    export default {
        data(){
            return{
                score:0
            }
        },
        computed:{
            ...mapState(['answerId']),
            ...mapGetters(['rightAnswer'])
        },
        created(){
            let every = 100/this.rightAnswer.length
            this.rightAnswer.forEach((item,index) =>{
                if(item === this.answerId[index]){
                    this.score+=every
                }
            })
        }
    }
</script>

<style lang="less" scoped>
h2{
    color: red;
}
</style>