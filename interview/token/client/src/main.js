import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import 'vant/lib/index.css';
import { Button,Form, Field, CellGroup } from 'vant';

const app = createApp(App)

app.use(Button)
app.use(Form)
app.use(Field)
app.use(CellGroup)
app.use(router).mount('#app')
