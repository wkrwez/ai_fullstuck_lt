## nest 核心依赖

- @nestjs/core
  核心模块，提供构建，启动，管理 nest.js 应用程序的基础设施

- @nestjs/common 包含了构建 nestjs 应用程序基础设施和常用装饰器，像控制器，管道，过滤器，守卫，异常过滤器，中间件等
- rxjs 用于构建异步和事件驱动程序的库
- reflect-metadata 实现元编程的库，提供元数据 api，可以在运行时操作和检查对象的元数据
- @nestjs/platform-express nestjs 的 express 平台适配器，提供中间件，路由等功能

"experimentalDecorators": true,启动实验性的装饰器特性
"target": "ES2021", //指定 ES 目标版本
"moduleResolution": "NodeNext", //如何查找第三方模块
"module": "NodeNext" 指定生成的模块代码系统
