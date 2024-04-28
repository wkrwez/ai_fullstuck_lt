# axios
 1. - 使用axios封装一个默认的请求URL用来和后端接口路径拼接，
    - 作用：当后端API的基础路径发生变化时，你只需修改这一处配置，而不必去修改每一个请求。
2. axios.defaults.withCredentials = true；在跨域请求时，Axios会携带当前网页的凭证信息（如Cookies）

跨域资源共享（CORS）
跨域资源共享（CORS）是一种机制，它使用额外的HTTP头来告诉浏览器让运行在一个源上的Web应用被允许访问来自不同源服务器上的指定的资源。当一个资源从与它不同的域、协议或端口请求一个资源时，资源会发起一个跨域HTTP请求。

withCredentials 属性
默认情况下，出于安全考虑，浏览器不会在跨域请求中发送任何身份凭证（如Cookies和HTTP认证信息）。如果你希望在进行跨域请求时携带这类凭证，你需要服务器设置Access-Control-Allow-Credentials头为true，同时前端也需要设置withCredentials为true。

- 服务器必须在响应头中包含Access-Control-Allow-Credentials: true，否则浏览器将不会把响应交给应用程序，并且请求也不会携带凭证。


3. axios.defaults.headers['token'] = localStorage.getItem('token') || '';

    - 这行代码设置了所有请求的默认请求头中的token字段。它尝试从浏览器的localStorage中获取名为token的项的值，如果不存在，则默认为空字符串。
    - 作用：token通常用于存储用户登录后从服务器获得的身份验证令牌，通过在请求头中携带token可以让服务器验证请求发送者的身份。

4. axios.defaults.headers.post['Content-Type'] = 'application/json'        
    Axios 发送 POST 请求时的 Content-Type 头部信息为 'application/json'，这样可以确保向服务器发送 JSON 格式的数据。
    JSON 格式的数据优点：易于编写和阅读，跨平台兼容性好，易于前后端交互，易于API集成

5. 设置axios的响应拦截器，用于在处理服务器返回的响应数据之前进行一些处理

    1代表信息状态码，请求被接受，正在处理
    2代表成功状态码
    3重定向状态码，客户端需要进一步操作才能发送请求
    4客户端错误状态码，客户端发送请求有错误
    5服务端错误状态码，服务端处理请求有错误

    post：增
    delete：删
    put：改
    get：查
    patch：改部分
## axios.defaults.baseURL = '//backend-api-01.newbee.ltd/api/v1'
- 使用axios封装一个默认的请求URL用来和后端接口路径拼接
- 作用：当后端API的基础路径发生变化时，你只需修改这一处配置，而不必去修改每一个请求。
## axios.defaults.withCredentials = true;
- 设置withCredentials为true，根据同源策略，可以在进行跨域请求时携带身份凭证token
## axios.defaults.headers['token'] = localStorage.getItem('token') || '';
    - 设置了所有请求的默认请求头中的token字段。它会从浏览器的localStorage中获取名为token的项的值，如果不存在，则默认为空字符串。
    - 作用：token通常用于存储用户登录后从服务器获得的身份验证令牌，通过在请求头中携带token可以让服务器验证请求发送者的身份。
## axios.defaults.headers.post['Content-Type'] = 'application/json'
- 设置axios发送的post请求数据为JSON格式，JSON格式的优点就是方便查阅和编写，易于前后端交互，便于API集成，跨平台兼容性好。

- 设置axios的响应拦截器，用于在处理服务器返回的响应数据之前进行一些处理，拦截请求中的状态码，判断是否成功连接。
# 登陆注册
先创建一个响应式数据type，type属性的取值，判断是执行登录操作还是注册操作。
如果type为'login'，则执行登录操作。调用login函数发送post请求，传递用户名和经过md5加密后的密码。使用await关键字等待登录请求返回结果，将返回的数据存储在data变量中。然后将从服务器返回的token数据存储在localStorage中，以便在用户的浏览器会话期间持久保存这个token。最后通过window.location.href实现页面的跳转（浏览器会刷新）到'/'路径。

用了全局路由守卫监听token是否有值

md5是一个哈希函数，用于将任意长度的输入转换为固定长度的输出，可用于加密。
缺点：碰撞攻击，用两个不同的输入值经过md5算法得到相同的散列值
     预图攻击：通过已知的散列值，找到对应的原始数据。
好的加密算法：SHA-256  bcrypt
将加密后的密码存到本地localStorage。
# 购物车
用一个组件来实现添加购物车功能，点击加入购物车按钮，触发添加购物车的post请求，通过父子组件传值将商品的id传给子件，子组件将id传递给后端，添加成功就通过触发vuex的仓库的actions方法去拿后端的购物车数据，将购物车的数量（取决于id数量）拿到并在mutations里面修改购物车数量。
# 提交订单
先向后端发送get请求获取到购物车的订单数量，再双向绑定购物车的全部商品id（需要双向绑定因为要渲染选中的商品打勾，有需要计算选中的商品的价格），通过判断选中商品的id数量是否和购物车的订单数量相等来判断是否选中所有商品，再更新选中的商品id数量。通过计算属性和数组方法includes检查哪些商品id被选中为true，通过fiter方法过滤显示为true的商品，更新需要付款的金额。
# 地址管理
先去路由查询参数中获取 cartItemIds。如果查询参数存在，就使用它；否则，会尝试从本地存储中获取。获取到的 cartItemIds 可能是一个JSON字符串形式的数组，所以使用 JSON.parse() 将其转换为JavaScript数组。之后，再次将这个数组重新保存到本地存储中。

再向后端发送请求获取购物车选中的id获取购物车的数据
## 地址
先将填好的地址信息通过路由传参发送到后端保存，再通过路由查询参数获取到地址id，再通过id从后端获取到地址信息，再将地址信息保存到vuex仓库中。
