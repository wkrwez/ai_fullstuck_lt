# 浮动
 - 脱离文档流
 - 文字环绕
 - 可以让块级元素同行显示
 - 让行内元素可以设置宽高
 - 浮动元素可以使用margin，但是不能使用margin：0 auto；


# 清除浮动
 - 直接给父容器设置高度
 - 增加子容器，在子容器身上清除浮动
 - 借助伪元素after
 - BFC


# BFC --Block Formatting Context
- 块级格式化上下文

- 如何创建bfc：
   - 浮动：float：left || right
   - 定位：position：absolute | fixed
   - 行内块：display：inline-block
   - 表格单元：display：table-cell | table-xxx
   - overflow：auto（自适应） | hidden（超出隐藏） | scroll（超出显示滚动条）
   - 弹性盒子：display:flex | inline-flex

- bfc容器的特征
   bfc的效果是让处于bfc内部的元素与外部的元素相互隔离，使内外元素的定位不会互相影响
   - 内部盒子会在垂直方向上一一排列(按照文档流的顺序排列)
   - bfc容器在计算高度时，会将内部浮动的子元素的高度也计算在内
   - 解决外边距重叠的问题
    