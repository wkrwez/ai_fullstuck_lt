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
						console.log(res);
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
	@import url("//at.alicdn.com/t/c/font_4323957_u61f1t953lg.css");
</style>