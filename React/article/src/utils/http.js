import axios from 'axios'



const http = axios.create({
    baseURL:'http://geek.itheima.net/v1_0',
    timeout:5000,
})

http.interceptors.request.use(config=>{
    return config
},(err)=>{
    return Promise.reject(err)
})


http.interceptors.response.use(response=>{
    return response
},(err)=>{
    return Promise.reject(err)
})

export {http}