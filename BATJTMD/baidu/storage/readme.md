# 百度前端情景题
- 用户体验
   - 不要让用户觉得麻烦
- 如果函数超过十行，一定可以拆分
    不利于维护
    - 提交
        1. preventDefault
        2. value的值，生成todo对象
        3. 渲染list  抽出来  复用
        4. reset表单

- 本地存储
  - localStorage
      - setItem
      - getItem
      - 浏览器的应用程序存储的一种，不会因为关闭页面而丢失
      - 用于存储一些用户的配置和关键信息
      - 如果值是对象，会有问题
          值Object.prototype.toString.call(val)
          [1,2,3]  '1,2,3'   [].join(',')
          { }    [Object Object]
  - 序列化 
      JSON.stringify(object)
      JSON.parse() 反序列化  成为一个对象


- 用户体验
    - 把用户当小白
        required  placeholder  表单html5特性
        减少了用户犯错的可能性，如果用户因操作不当，表单提交失败了，它会失望的，离开网站。