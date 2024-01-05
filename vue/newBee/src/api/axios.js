import axios from 'axios'
import { showFailToast } from 'vant';
import router from '@/router';

// 将axios在封装一次，让之后项目中使用更便捷
axios.defaults.baseURL = '//backend-api-01.newbee.ltd/api/v1' // http://192.168.31.45:3000/home
axios.defaults.withCredentials = true // 是否允许在请求头中携带凭证
axios.defaults.headers['token'] = 'xxxxxx'
axios.defaults.headers.post['Content-Type'] = 'application/json' // 告诉后端，所有post请求传递的参数都是json对象

// 响应拦截
axios.interceptors.response.use = function(res) {
  if (typeof res.data !== 'object') { // 程序性错误
    showFailToast('服务器异常');
    return Promise.reject(res)
  }
  if (res.data.resultCode !== 200) { // 逻辑性错误
    if (res.data.message) showFailToast(res.data.message);

    // 登录失效
    if (res.data.resultCode == 416) {
      // 强行跳转登录页面
      router.push('/login')
    }
    return Promise.reject(res.data)

  }
  return res.data
}

export default axios



