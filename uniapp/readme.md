# uni.reLaunch 
- 是微信小程序中的一个页面跳转 API，用于关闭所有当前页面，跳转到应用内的某个指定页面，并且可以带上参数。

以下是 uni.reLaunch 的基本语法：

javascript
uni.reLaunch({
  url: '/pages/index/index', // 跳转的目标页面路径
  success: function(res) {
    // 跳转成功时的回调函数
  },
  fail: function(res) {
    // 跳转失败时的回调函数
  },
  complete: function(res) {
    // 不论跳转成功或失败，都会执行的回调函数
  }
})


# setStorageSync 和  getStorageSync
- 是uniapp中的一个同步方法，用于将数据存储到本地缓存中。

    在uniapp中，可以使用本地缓存来存储一些临时数据或用户的个人设置等。uni.setStorageSync 可以用于向本地缓存中同步存储指定的数据。

    以下是 uni.setStorageSync 的基本语法：

    uni.setStorageSync(key, data);
    其中：

    key 是要存储的数据的键名（key）。每个数据在本地缓存中都与一个唯一的键名相关联。
    data 是要存储的数据值（value）。可以是字符串、数字、布尔值、对象等任意类型的数据。
## getStorageSync
- uni.getStorageSync 是一个微信小程序提供的同步获取本地缓存数据的方法。
    let value = wx.getStorageSync(key);


# onLaunch 
- 是小程序生命周期函数之一，它是在小程序启动时执行的函数。

 onLaunch: function() {}

当用户打开小程序时，onLaunch 函数会被触发，可以在该函数中进行一些初始化操作、获取用户信息、检查登录状态等。它类似于其他编程框架中的 "应用启动" 或 "应用初始化" 阶段。
