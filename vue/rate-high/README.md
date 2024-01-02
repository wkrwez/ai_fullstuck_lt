# 雨晨

- 简历
    Boss直聘 聊天
    - 前端全栈 vue  年前正式面式
    - ai 岗位 绘图  
    杭州 海康卫视 

- VUE 写
    - 组件 评分
    - 显示和数据    4.5
    - 加一项功能 要点击星星评分 click
    - 鼠标经过 显示星星

- rate 组件
    - 它是一个基本每个电商项目都有的组件，通有组件，手写一下，挺复杂的
    - vue开发要忠于数据驱动
        父组件给我们value，rate 组件mouseover mouseout 私有数据width 来驱动
        当click打完分后，需要汇报给父组件，父组件和子组件状态的统一
    - props + emits
        子组件不可以直接修改props的，vue数据除v-model是单向的，
        如果要改，遵守流程，就是emit
        - 父组件会以自定义事件的方式，定义一个事件，并接受传参，同步状态
            @update-rate = "update"
        - 子组件 defineEmits([])  emits 数组
        - emits('update-rate',num)