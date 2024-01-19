<template>
	<view class="header">
		<uni-icons type="bars" size="22" @click="showMenu"></uni-icons>
		
		<view class="content">
			<!-- 添加一个插槽 -->
			<slot name="content"></slot>
		</view>
		
		<uni-icons :type="icon" size="22"></uni-icons>
	</view>
	<view class="box"></view>
</template>

<script setup>
	import { useStore } from 'vuex';
	const store = useStore()
	
	defineProps({
		icon: {
			type: String,
			default: 'mic'
		}
	})
	
	const showMenu = () => {
		store.commit('changeIsShowMenu', true)
	}
</script>

<style lang="scss" scoped>
.header{
	height: 100rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 15rpx;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	box-sizing: border-box;
	z-index: 999;
}
.box{
	height: 100rpx;
}
</style>