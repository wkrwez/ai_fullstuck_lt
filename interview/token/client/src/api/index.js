import axios from "axios";
import router from '../router/index.js'



//封装axios，请求头里自带token,
// 接口请求就不需要一直发token给后端，只会执行一次
// axios.defaults.headers['token'] = localStorage.getItem('token')||''

axios.defaults.baseURL = "http://localhost:3000"

//发送请求后的请求拦截,查看本地是否有token
axios.interceptors.request.use(config=>{
    let token = localStorage.getItem('token')
    if(token){
        config.headers.Authorization = token
    }
    return config
})

//响应拦截,
axios.interceptors.response.use(res=>{
    //逻辑错误
    if(res.data.code !==0 && res.data.code){ //自己写的0就成功
        //返回后端数据的error
        return Promise.reject(res.data.error)
    }
    //程序性错误
    if(res.data.status >= 400&& res.data.status < 500){
        
        router.push('login')
        return Promise.reject(res.data)
    }

    return res
},
// (error)=>{
//     //程序性错误,状态码判断，没有权限
//     if(error.response.status >= 400&& error.response.status < 500){
//         router.push('login')
//     }
//     return Promise.reject(error.response.data.error)

// }
)

export function post(url,body){
    return axios.post(url,body)
}