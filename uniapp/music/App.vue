<script>
	import baseUrl from '@/api/request.js'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 判断用户是否登录
			let key = uni.getStorageSync('cookie')
			if (!key) {
				this.$store.commit('changeLoginState', false)
				return
			}
			// 获取登录状态
			uni.request({
				url: baseUrl + '/login/status',
				data: {
					cookie: key
				},
				success: (res) => {
					console.log(res.data.data.account.id);
					let id = res.data.data.account.id
					if (id) {
						this.$store.commit('changeLoginState', true)
						this.getUser(key)
					}
				}
			})
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			getUser(key) {
				if (!key) return
				uni.request({
					url: baseUrl + '/user/account',
					data: {
						cookie: key
					},
					success: (res) => {
						// console.log(res);
						let nickname = res.data.profile && res.data.profile.nickname
						let id = res.data.profile && res.data.profile.userId
						let avatar = res.data.profile && res.data.profile.avatarUrl
						this.$store.commit('getUserInfo', {nickname, userId: id, avatar})
					}
				})
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("https://at.alicdn.com/t/c/font_4416312_nx5ij0249e.css");
	*{
		margin: 0;padding: 0;
	}
	html,body{
		width: 100%;
		height: 100%;
	}
	#app{
		height: 100%;
	}
	uni-page-body{
		height: 100%;
		overflow-y: scroll;
	}
	.boxShadow{
		position: relative;
		perspective: 400px;
		transform-style: preserve-3d;
	}
	.boxShadow::after{
		content: '';
		display: block;
		width: 95%;
		height: 100%;
		position: absolute;
		z-index: 2;
		top: -16rpx;
		left: 2.5%;
		background-color: #6e9d8b;
		border-radius: 8px;
		transform: translateZ(-30rpx);
	}
	.boxShadow image{
		position: relative;
		z-index: 10;
	}
</style>