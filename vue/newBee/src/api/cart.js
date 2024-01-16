import axios from './axios.js'

export function getCart(params) {
  return axios.get('/shop-cart', params)
}

export function addCart(params) {
  return axios.post('/shop-cart', params)
}

export function modifyCart(params) {
  return axios.put('/shop-cart', params)
}


export function deleteCartItem(params) {
  return axios.delete(`/shop-cart/${params}`)
}

export function getCartItemIds(params) {
  return axios.get('/shop-cart/settle', {params})
}
// export default getCart