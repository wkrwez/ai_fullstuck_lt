# 百度代码能力之设计模式

- 单例模式
   23种设计模式的核心模式
   一个类全局只实例化yc
- 实现方案
   绕过new  不同的内存，肯定不是同一个对象false
   static 方法 类的方法
   判断挂载在类上的静态属性static
   第一次为空， 实例化并返回，之后，直接返回实例
- 典型案例
   单例的登录弹窗
- js 单例还有别的方法吗？