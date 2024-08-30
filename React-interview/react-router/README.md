
# React Router
通过点击链接来更新URL，不会向服务器发送请求。并且应用程序可以立即渲染新的UI，使用fetch请求数据，用新数据更新页面。


```jsx
{
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
    {
        index: true,
        element: <Index />,
     },
    ]
}
```

- createBrowserRouter


    用于创建一个基于浏览器历史记录的路由实例，通常和Router组件配套使用，提供单页面应用的路由功能
    - element:路由页面组件


    - action: 发送非获取提交（“post”、“put”、“patch”、“delete”）时，就会调用操作,通常用于表单提交。接受两个参数：
        - param: 接收URL动态段参数
        - request：发送到路由的请求的实例


        ```js
            export async function action({ request, params }) {
              const formData = await request.formData();
              const updates = Object.fromEntries(formData);
              await updateContact(params.contactId, updates);
              return redirect(`/contacts/${params.contactId}`);
            }
        ```
    - errorElement:页面发生异常时，显示的UI。
    - index:索引路由，当路由在某个路径上没有匹配的子页面需要渲染将使用索引路由，可以当作默认路由。
    - loader：在文章的后面

# 不起眼的：
单独拿出来是觉得这个容易看懂。
```jsx
{
   path: "contacts/:contactId", //:代表URL中的动态段，contactId:URL参数param
   element: <Contact />,
   loader: contactLoader,
   action: contactAction,
},
```

param通过与动态段匹配的键传递给loader，当然action同样也可以通过params拿到


```jsx
export async function loader({ params }) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return { contact };
}
```


# Link
类似于a标签，使用Link标签就不会向服务器发送请求，而是在浏览器中改变URL，不会刷新页面。
<!-- <Link to='home/first'></Link> -->
- preventScrollReset
    使跳转链接后窗口处于点击链接窗口的位置，而不是回到顶部。
- relative
    - to(默认) : 使用绝对路径，链接相对于根路径
    - path ：使用相对路径，链接是相对于当前路由路径的
    
    
    当有两个path=‘/’下的子路由first和second时，
    - 从first去到second页面：
        - to：`<Link to='/second'></Link>`
        - path：`<Link to='../second' relative='path'></Link>`<br>
        ..代表指向他的上一级路由,vscode的cd ..代表回到上一级目录。
    

# 加载器loader
- loader 
是一个异步函数，用于在路由组件挂载之前异步加载数据。加载器在服务端渲染和客户端渲染前异步加载数据,可以访问 URL 参数和其他上下文信息。loader函数返回的数据可以通过 useLoaderData 钩子在路由组件中访问。


- useLoaderData
帮助我们拿到loader函数返回的数据。
不会发起fetch，而是读取react-router内部管理的请求的数据。它仅在操作或某些导航后再次调用加载器时才会更改
如果数据还未加载会返回null，直到数据加载完成才会渲染组件



# NavLink
创建具有激活高亮状态的导航链接的组件，一般用于选中导航栏的高亮

参数：
- to：什么时候被激活
- className：未激活类名，也可以通过传递函数控制。

函数三个参数isActive(激活),isPending(未激活),isTransitioning(过渡状态)
```js
className={
({ isActive, isPending, isTransitioning }) => 
[ 
    isPending ? "pending" : "", 
    isActive ? "active" : "", 
    isTransitioning ? "transitioning" : ""
 ].join(" ") } >
```
- activeClassName：当前导航与链接相同添加时的类名。
- activeStyle：当前导航与链接相同时的内联样式。
- end：true严格匹配，匹配to的URL，URL完全匹配才会变为激活状态。

# useNavigation
使用useNavigation钩子可以获取全部导航信息，

- navigation.state有三种状态：
    - idle（空闲）
    - submitting (由于使用 POST、PUT、PATCH 或 DELETE 提交表单，正在调用路由操作)
    - loading (正在调用下一个路由的加载器来呈现下一页)。
        可以借助此状态来完成一些效果：
        
    ```jsx
    <div
       className={navigation.state === "loading" ? "loading" : ""}
    >
       <Outlet />
    </div>
    ```
    当路由状态为loading时加上一个类名，这里是在发生交互后在导航加载时添加css，给需要加载的二级路由页面添加过渡css。
    
    - 正常导航和GET请求会发生：idle -> loading -> idle
    - POST、PUT、PATCH 或 DELETE 提交表单:
    idle -> submitting -> loading -> idle
- navigation.location： 获取下一个导航
# useNavigate
传递-1会回到路由历史栈的上一个
- replace : 为true时将替换浏览器历史栈的内容，而不是新增一条
- state


```js
navigate('../contacts', { state: { key:'work' } });

```


   增加状态在浏览器页面历史状态，通过useLoaction获取。让我突然想到history.state可以获取通过pushState和replaceState添加的历史条目的state，获取到的是当前活动页面的state，也就是历史栈顶。

- preventScrollReset ：使跳转链接后窗口处于点击链接窗口的位置，而不是回到顶部。
- relative : 和Link标签一样
```
navigate('../contacts', { relative: 'path' });

navigate('/contacts', { relative: 'to' });

```


# Outlet
子路由的入口组件，如果路径匹配将展示匹配路由的UI。使用方法：


```jsx
export default function App(){
    return (
        <div>
            <div></div>//其他页面
            <Outlet> 展示子路由页面，二级路由
        </div>
    )
}
```
