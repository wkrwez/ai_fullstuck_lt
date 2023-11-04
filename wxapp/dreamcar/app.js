// app.js
App({
    //    生命周期函数
  onLaunch() {
   console.log('应用启动了');
   wx.request({
     url: 'https://resources.ninghao.net/wxapp-case/db.json',
     success:(response)=>{
        //  console.log(response);
        this.globalData = response.data
     }
   })
  },
  globalData: {
    userInfo: null
  }
})
