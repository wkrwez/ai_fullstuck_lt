# 说说你对css盒模型的理解 
1. 是什么？
浏览器在页面布局时，将所有的元素表示为一个个矩形盒子，每一个盒子包含四个部分：content(内容)、padding、border、margin。

2. 标准盒模型
盒子总宽度：content（width） + padding + border + margin

3. 怪异盒模型(IE)
盒子总宽度：width + margin
会缩减content的宽度，padding和border的宽度会融入到content中

# css中的选择器有哪些？说说优先级
1. id选择器
2. 类名选择器
3. 标签选择器
4. 后代选择器
5. 子选择器
6. 相邻兄弟选择器
7. 群组选择器

8. 属性选择器
9. 伪类选择器
10. 伪元素选择器

!important > 内联 > id选择器 > 类名选择器 > 标签选择器 



# 说说css中的单位有哪些？
1. px : 像素单位，屏幕上的发光点
2. rem：相对单位，相对于跟字体大小
3. em：相对单位，用于字体继承父容器字体大小，用在他处，是相对于当前容器自己的字体大小来定的（字体大小可以继承于父容器）
4. rpx
5. vw/vh ： 相对单位，相对于窗口宽高比
6. % ：相对单位，相对于父容器的


# 说说设备像素，css像素，设备独立像素，dpr，ppi之间的区别？
1. pc端 1px == 1个物理像素
2. 页面缩放比为1:1时，1px == 1个物理像素

 设备像素 === 物理像素
 css像素 === 1px
 设备独立像素 === 分辨率
 dpr（设备像素比） = 设备像素 / 设备独立像素
 ppi === 像素的密度


 # css中有哪些方式可以隐藏页面元素？区别是什么？
 1. display:none              脱离文档流  无法响应事件  回流重绘
 2. visibility:hidden         占据文档流  无法响应事件  重绘
 3. opacity:0                 占据文档流  响应事件      重绘 || 不重绘
 4. position:absolute;        脱离文档流  无法响应事件  
 5. clip-path                 占据文档流  无法响应事件  重绘


 谈谈你对BFC的理解
 - 是什么
    块级格式化上下文，是页面中一个渲染区域，有一套属于自己的渲染规则

 - 渲染规则
    1. BFC容器在计算高度时，浮动元素的高度也会计算在内
    2. BFC容器内的子元素的margin-top不会和BFC这个父容器发送重叠
    3. 遵照从上往下从左往右的顺序渲染

- 触发条件
    1. overflow:不为visible
    2. display:table-xxx || inline-block || inline-xxx || flex || grid
    3. float
    4. position:absolute || fixed
- 应用
    清除浮动

# 水平垂直居中  !!

1. position: absolute;( + left50% + top50% + translate) || margin负值(已知宽高)
2. display：flex；
    align items：center；
    justifing content:center;
3. grid
4. 给父容器加display:table-cell；text-align:center;      
        vertical-align:middle;(子容器不能是块级)
    子容器加display：inline-block；

5. margin（已知宽高）

# 三栏布局怎么实现
- 两栏布局：
1. display:flex    第二个盒子flex:1
2. float + margin-left
3. grid
- 三栏布局：
1. display:flex  flex：1
2. grid
3. 左右先加载内容后加载：float + margin
4. 圣杯布局：float + margin负值 + position:relative 
5. 双飞height: 200px;
            width: 200px;


# 说说flexbox
- 是什么？
    是一种布局方式，可以简便完整响应式(自适应)的实现页面布局。容器中默认存在两条轴，主轴，交叉轴，默认x轴为主轴，可以用flex-direction来改变轴的方向

- 特征
    1. 可以控制子元素主轴上的对齐方式
    2. 可以控制子元素交叉轴上的对齐方式
    3. 可以控制子元素 缩放比例，排列方式

- 应用场景
    1. 多栏布局
    2. 居中
    


# 10.css3新增了哪些属性？
1. 选择器：属性选择器，伪类选择器
2. box-shadow：阴影
3. background-clip：裁剪
4. transition(过渡)
    box:hover
5. transform(变形)
6. animation(动画)
7. 渐变色


# 11.css3中常见的动画哪些？
box:hover
box{
1. transition(过渡)   当其他属性值发生变更时，控制该值变更所花费的事件以及变更曲线
2. transform(变形)     用于做容器的旋转，平移，缩放，倾斜等动画
}
3. animation(动画)      控制容器动画的关键帧
    @keyframes

# 12. 说说回流重绘（重排重绘）
- 是什么
    回流：浏览器渲染页面之前需要对结构进行布局计算
    重绘：将已经计算好布局的容器绘制出来
- 触发条件
    回流：页面上有容器的几何属性发生变更
    重绘：容器非几何属性变更 （字体，颜色）

    回流必定重绘


# 13.什么是响应式
- 是什么
    响应式布局，是根据设备的宽度来响应式布局，达到不同设备的适配。

- 实现方案
1. flex （适用于某个容器内的响应式）
2. %     (常适用于外层大容器,根据父容器的宽度)
3. rem + pc(媒体查询 @media screen and (min-width: 768px) and... :屏幕宽度大于768px) || 移动端(js)      ----媒体查询放根字体
4. 媒体查询                   ----更复杂
5. vw/vh (适用于外层大容器)    ----相对window的大小


# 14. 视差滚动效果如何实现
- 是什么
    多层背景以不同速度进行移动，形成视差滚动效果

- 实现
1. background-attachment: fixed;

2. perspective + translateZ

# 15.css画一个三角形
1. border：50px solid  + border-color  可以用伪元素遮挡形成其他图形

# 16. 如何显示一个小于10px的文字
1. zoom  (改变焦距，近大远小)
2. transform: scale(0.01) (缩放，倍数)