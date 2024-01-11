import axios from './axios.js'

export function login(params) {
  return axios.post('/user/login', params)
}

export function register(params) {
  return axios.post('/user/register', params)
}