1. number
2. string
3. boolean
4. array
5. 元组：tuple，已知数据类型的数组
6. 枚举
7. void
8. any
9. unknown:可以赋值任何类型，但是使用时需要类型断言和类型检测。表示需要明确类型
10. never：表示一个值得类型永不存在
11. 联合类型：|
12. 交叉类型：&
13. 类型别名：type Name = string | number
14. 类型断言：as const
15. 泛型：T

    ```
    function getProperty<T, K extends keyof T>(obj: T, key: K) {
        return obj[key];
    }

    let x = { a: 1, b: 2, c: 3 };

    getProperty(x, "a"); // 正确
    // getProperty(x, "m"); // 错误
    ```

```

```
