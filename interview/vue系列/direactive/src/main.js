import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import lazyLoad from './direactives/lazyLoad'

const app = createApp(App)
//全局注册指令
app.directive('lazy', lazyLoad)
app.mount('#app')
