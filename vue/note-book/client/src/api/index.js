import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.headers.post['Content-Type'] = 'application/json'

//请求拦截


//响应拦截
axios.interceptors.response.use(res=>{
    if(res.status !== 200){ //请求错误
        showFailToast('服务器异常')
        return Promise.reject(res)
    }else{
        if(res.data.code !== '8000'){
            showFailToast(res.data.msg)
            return Promise.reject(res)//res会变成promise对象
        }
        return res.data
    }
})


export default axios