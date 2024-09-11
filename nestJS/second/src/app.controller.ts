import { Controller, Get } from "@nestjs/common";

@Controller("a")
export class AppController {
  @Get("b")
  getHello(): string {
    return "Hello World!";
  }
}
/**
 * @Controller是装饰器，用于定义控制器
 * 控制器是处理HTTP请求的核心组件，每个控制器用于处理特定的请求路径和对应的http方法
 * 在控制器内部，会使用路由装饰器，@Post，@Get来定义路径和请求方法
 * @Get也是一个路由装饰器，用于将控制器的方法(getHe11o)映射到HTTP的GET请求
 * 当客户端使用GET方法访问 路径/a/b ['a','b']
 * 通过@Get装饰器，可以指定该方法处理GET请求
 */
