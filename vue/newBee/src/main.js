import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'lib-flexible/flexible'
import './assets/style/reset.css'
//引入你需要的组件
import { Button, Swipe, SwipeItem, Skeleton,Tabbar,TabbarItem } from 'vant';
import 'vant/lib/index.css';

const app = createApp(App)
app.use(Button)
app.use(Swipe);
app.use(SwipeItem);
app.use( Skeleton);
app.use(Tabbar);
app.use(TabbarItem);

app.use(router)
app.mount('#app')
