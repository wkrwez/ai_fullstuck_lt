# vue生命周期
- vue 自带的生命周期在uniapp中都能使用
# 页面生命周期
- uniapp 提供了 页面生命周期，比如上拉加载，下拉刷新   钩子函数

# 应用生命周期
- 整个app应用的状态变化，只能在App.vue使用

# 全局变量
- Vue.prototype.name = '测试名称'	(options API)
- 在App.vue中设置
```App.vue
globalData:{
	name:'全局的名称'
},
```
getApp().globalData.name  //拿到app.vue的name
# 路由跳转

```javascript
uni.navigateTo({
	url:'/pages/about/about'
	})
```
