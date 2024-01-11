import axios from './axios.js'

export function getCart(){  //export引入不用{}，default引入需要{}
    return axios.get('./shop-cart')
}

export function addCart(params){
    return axios.post('./shop-cart',params)
}