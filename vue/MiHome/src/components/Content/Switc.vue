<template>
    <div class="all">
    <div class="content">
            <div class="header">摄影机</div>
            <div class="wiring">
                <div class="equip">
                    <img src="../../photo/1.jpg" alt="">
                    <div class="desc">小米智能摄像机米智能摄像机小米智能摄像机小米智能摄像机</div>
                </div>
                <div class="equip">
                    <img src="../../photo/1.jpg" alt="">
                    <div class="desc">小米智能摄像机米智能摄像机小米智能摄像机小米智能摄像机</div>
                </div>
                <div class="equip">
                    <img src="../../photo/1.jpg" alt="">
                    <div class="desc">小米智能摄像机米智能摄像机小米智能摄像机小米智能摄像机</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>

</script>

<style lang="less" scoped>
.all{
    width: 100%;
    display: flex;

.content {
        width: 252px;
        margin-left: 10px;
        .header{
            width: 100%;
            height: 90px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .wiring {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-column-gap: 5px;

            .equip {
                width: 80px;
                height: 100px;
                text-align: center;
                margin-bottom: 10px;

                img {
                    width: 60px;
                    height: 70px;
                    margin-bottom: 5px;
                }

                .desc {
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    width: 80px;

                }
            }
        }
    }
}
</style>