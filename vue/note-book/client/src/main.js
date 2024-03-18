import { createApp } from 'vue'
import 'lib-flexible/flexible';
import App from './App.vue'
import './style/reset.css'
import router from './router/router.js'
 
const app = createApp(App)

app.use(router)
.mount('#app')
