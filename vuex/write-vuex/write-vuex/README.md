## 海马体

- 2023年AIGC现象级应用
- 以前花99.9 拍海马体照片
    化个妆、修个片，选个风格 证件照 简历    
- 海马体App 用AIGC 技术完成，
    只需9.9，上传自己的一些照片，就可以生成
- LLM 找到应用场景落地的成功案例
    tokens 赚钱的
- 我很想加入海马体，这只团队找到了AI落地的感觉，肯定会在更多的领域，找到AI产品开发的灵感，
    在这样的团队里做前端开发会有好未来，因为未来是属于AI的，未来一定是属于知道怎么让AI落地的团队的


- vuex是数据流管理的设计模式，由state，getters，mutations，actions 构成
- UI组件（简单） + 数据管理（清晰、共享）大型项目   
- 缺点是学习成本高、难理解 mutation
- optionsAPI 太繁琐了，pinia和composition api更搭
- pinia也更好理解  use
- createStore store单例 数据的安全和正确， 只能有一个官



- 请介绍下自己
    了解你
    破冰
        我平时喜欢在掘金写技术文章
        通过阅读源码提升代码能力
    
- vue 源码学到了什么
    - 严谨的代码逻辑
        vuex 根据type查找mutation时候 && 找到了会执行
    - 优秀的代码思想
        提升自己的代码能力

- vuex 源码学到了哪些？
    - createStore 返回了store状态树单例
        因为它只会被调用一次
    - provide/inject
        use(store) 启用了vuex生态
        install 方法，传递app
    - dispatch commit 方法
    - API使用者 -> 了解底层和原理->使用VUE 更得心应手
    - es6 class 封装Store 类
        - 把复杂留给自己 把简单交给别人
            options state 函数返回的对象是初始数据
            使用reactive()响应式，
            而且加上data 数据概念
            完成响应式数据的创建 即 this._state
        - _ 代表私有属性
            get 方法 get state 返回this._state。
    - es6 class 语法
        - es6 主要目的是让JS 适合大型项目企业级开发 ,简洁优雅
        - 箭头函数  解构 模板字符串
            传统的面向对象支持
            class constructor extends static get set
        - 依然原型链式的面向对象
        - class只不过是语法糖
        - proxy
            聊到reactive源码
        - Map WeakMap   JSON Object新的数据结构(obj={},key不能是对象 )
            Set WeakSet
        - es6 模块化
        - promise
        - async await