import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
//全家桶 启用一下
import {createPinia} from 'pinia'

createApp(App)
    .use(createPinia())
    .mount('#app')
