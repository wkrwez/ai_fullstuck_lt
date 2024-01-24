<template>
	<view class="login">
		<view class="logo">
			<image src="../../static/icon/wangyiyun1-active.png" mode="aspectFill"></image>
		</view>
		
		<view class="login-body">
		
			<view class="qrimg">
				<text v-if="qrimg">{{msg}}</text>
				<view class="login-img">
					<image v-if="qrimg" :src="qrimg" mode="aspectFill"></image>
				</view>
			</view>
			
			<view class="start">
				<view class="traveler" @click="goIndexPage">
					立即体验
				</view>
				<view class="qr-login" @click="qrLogin">
					扫码登录
				</view>
			</view>
		</view>
		
		
		
		
	</view>
</template>

<script setup>
import { ref } from 'vue';
import baseUrl from '@/api/request.js'
import { useStore } from 'vuex'

const store = useStore()
let msg = ref('扫一扫')
let qrimg = ref('')


const goIndexPage = () => {
	uni.reLaunch({
		url: '/pages/index/index'
	})
}

const qrLogin = () => {
	// 获取key
	uni.request({
		url: `${baseUrl}/login/qr/key?timestamp=${Date.now()}`,
		success: (res) => {
			let key = res.data.data.unikey
			// console.log(res.data.data.unikey);
			
			// 获取二维码图片
			uni.request({
				url: `${baseUrl}/login/qr/create?key=${key}&qrimg=true&timestamp=${Date.now()}`,
				success: (result) => {
					// console.log(result.data.data.qrimg);
					qrimg.value = result.data.data.qrimg
					
					// 检验二维码状态
					const timmer = setInterval(() => {
						uni.request({
							url: `${baseUrl}/login/qr/check?key=${key}&timestamp=${Date.now()}`,
							success: (response) => {
								console.log(response);
								msg.value = response.data.message
								if (response.data.code === 803) {
									msg.value = response.data.message
									clearInterval(timmer)
									// 本地缓存cookie用户信息
									uni.setStorageSync('cookie', response.data.cookie)
									// 修改创库中的登录状态
									store.commit('changeLoginState', true)
									// 调用App.vue中的方法获取用户详情信息
									getApp().getUser(response.data.cookie)
									
									uni.reLaunch({
										url: '/pages/index/index'
									})
								}
							}
						})
					}, 1000)
					
				}
			})
		}
	})
}
</script>

<style lang="scss">
.login{
	height: 100vh;
	background: linear-gradient(#f9ebeb, #ffffff);
	position: relative;
	.logo{
		width: 150rpx;
		height: 150rpx;
		position: absolute;
		top: 200rpx;
		left: 50%;
		margin-left: -75rpx;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.login-body{
		position: absolute;
		top: 400rpx;
		left: 50%;
		transform: translateX(-50%);
		.qrimg{
			text-align: center;
			.login-img{
				width: 400rpx;
				height: 400rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
		.start{
			margin-top: 50rpx;
			display: flex;
			justify-content: space-between;
		}
	}
}
</style>