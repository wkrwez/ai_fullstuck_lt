import { createApp } from 'vue'
import App from './App.vue'
import 'lib-flexible';
import './assets/style/reset.css'
import router from './router'
import { Swipe, SwipeItem,Button,Icon,Popup,Grid, GridItem,Tabbar, TabbarItem,NavBar,Search   } from 'vant';
import 'vant/lib/index.css';

const app =  createApp(App)
app.use(Button);
app.use(Icon);
app.use(Popup);
app.use(Grid);
app.use(GridItem);
app.use(Tabbar);
app.use(TabbarItem);
app.use(NavBar);
app.use(Search);
app.use(Swipe);
app.use(SwipeItem);


app.use(router)
.mount('#app')
