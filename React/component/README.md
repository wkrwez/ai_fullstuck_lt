# 组件

- props 中的数据类型
1. 安装prop-types 依赖
2. 为组件添加校验规则
3. 可以限定props中参数的类型、是否必传、可以指定参数的特定结构
    List.propTypes = { //在为组件添加校验规则
    colors:PropType.array,
    fn:PropType.func.isRequired, //必须传isRequired
    obj:PropType.shape({
        name:PropType.number
    })
    }

- props 的默认值的写法
1. 函数式组件
2. class组件

# 生命周期
- 挂载阶段
1. constructor
2. render
3. componentDidMount

- 更新阶段
1. render
2. componentDidUpdate

- 卸载