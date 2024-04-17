import axios from 'axios'
import {getToken} from '@/utils'



const http = axios.create({
    baseURL:'http://geek.itheima.net/v1_0',
    timeout:5000,
})

http.interceptors.request.use(config=>{
    const token = getToken()
    if(token){
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
    
},(err)=>{
    return Promise.reject(err)
})


http.interceptors.response.use(response=>{
    return response.data
},(err)=>{
    return Promise.reject(err)
})

export {http}