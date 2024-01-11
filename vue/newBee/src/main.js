import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'lib-flexible/flexible'
import './assets/style/reset.css'
import store from './store'
//引入你需要的组件
import { Button, Swipe, SwipeItem, Skeleton, Tabbar, TabbarItem, Icon, Form, Field, CellGroup, ActionBar, ActionBarIcon, ActionBarButton } from 'vant';
import 'vant/lib/index.css';

const app = createApp(App)
app.use(Button)
app.use(Swipe);
app.use(SwipeItem);
app.use(Skeleton)
app.use(Tabbar);
app.use(TabbarItem);
app.use(Icon);
app.use(Form);
app.use(Field);
app.use(ActionBar);
app.use(ActionBarIcon);
app.use(ActionBarButton);
app.use(CellGroup);

app.use(router)
app.use(store)
app.mount('#app')
