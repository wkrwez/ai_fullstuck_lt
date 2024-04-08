# react
1. 也是组件式开发（存在父子，兄弟组件）
2. jsx === js + XML （在js中写html）
    1. js需要写在{}中
    2. jsx 中不能存在if语句
    3. jsx 必须要有一个根节点
## 父子组件通讯
- props接收
    1. 类编程
    父组件：<CChild msg={this.state.msg}/>
    子组件：<p>{this.props.msg}</p>

    2. 函数编程
    子组件：接收参数props，props.msg

    3. 可以传递的类型
        字符串，数字，布尔
        数组，函数，jsx语法

4. 兄弟 