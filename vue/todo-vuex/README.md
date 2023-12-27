# vue 数据流

- 数据流
    数据库todos-> MVC 架构 router + controller + model

- HTTP
    GET  /todos MVC
    router  /todos 
    controller  todosController  业务逻辑  select * from todos;
    model 表的结构抽象  
    api 接口 返回json   

- 前后端分离 
    - api
    - vuex  vue大型项目，大公司一样  财务
        state  getters  mutations actions

    - api    ->vuex(管理着页面要的数据)  ->  component

- vue 组件开发难的是设计数据
    - ref/reactive 私有数据
    - props 父组件
    - computed  计算属性