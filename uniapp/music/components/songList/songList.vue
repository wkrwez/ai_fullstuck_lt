<template>
	<view class="recommend">
		<view class="recommend-hd">
			<view class="title">推荐歌单</view>
			<view class="more">
				<uni-icons type="right" size="16"></uni-icons>
			</view>
		</view>
		<view class="recommend-bd" v-for="item in list" :key="item.id">
			<view class="recommend-bd__item">
				<view class="item-pic">
					<image :src="item.picUrl" mode="aspectFill"></image>
				</view>
				<view class="title">{{item.name}}</view>
			</view>
			
		</view>
	</view>
</template>

<script setup>
defineProps({
	list:Array
})
</script>

<style lang="scss" scoped>
.recommend {
	.recommend-hd {
		display: flex;
		justify-content: space-between;
		font-size: 30rpx;
	}
	.recommend-bd {
		display: flex;
		overflow-x: scroll;
		margin-top: 20rpx;
		.recommend-bd__item{
			flex: 0 0 240rpx;
			margin-left: 30rpx;
			&:nth-child(1){
				margin-left: 0;
			}
			.item-pic{
				width: 240rpx;
				
				image{
					width: 100%;
					height: 240rpx;
				}
			}
			.title{
				font-size: 24rpx;
				display: -webkit-box;
				//显示两行，超出打点隐藏
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				text-overflow: ellipsis;
				overflow: hidden;
				color: #2c2c2c;
			}
		}
	}
}
</style>