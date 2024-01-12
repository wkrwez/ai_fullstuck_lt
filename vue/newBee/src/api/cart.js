import axios from './axios.js'

export function getCart(params){  //export引入不用{}，default引入需要{}
    return axios.get('./shop-cart',params)
}

export function addCart(params){
    return axios.post('./shop-cart',params)
}

export function modifyCart(params){
    return axios.put('./shop-cart',params)
}

export function deleteCartItem(params){
    return axios.delete(`./shop-cart/${params}`)
}
