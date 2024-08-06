# TailWind Css
- 简介
tailwindcss 是基于 PostCss 构建的一个高度可定制的、低级的CSS框架。通过postcss将源代码转换为css文件。
而postcss是用于转换css的工具，它允许开发人员使用js插件来处理和转换css代码。
- 丰富的插件生态系统：css预处理，后处理，css格式化，css优化压缩。
- 学习成本低：简易的API。
- 支持最新的css特性：css嵌套，css变量，css模块。
- 自由灵活的使用方式：根据需求自行决定css的处理流程。
- 与构建工具集成：与各种构建工具集成(webpack、)，实现自动化的css处理和构建流程。


 安装
```bash
npm install -D tailwindcss
```

 初始化
```bash
npx tailwindcss init
```

 配置
```bash
npx tailwindcss init -p
```

 编译
```bash
npx tailwindcss -i./src/input.css -o./dist/output.css --watch
```
# 使用方式
类名由一个或多个单词组成，通过 - 连接
1. 在tailwind.config.js的theme中添加extend。
2. 对类名修改：text-[13px]

# 扩展内置的类名
1. 通过@layer，@apply
2. 自定义插件

# 解决className冲突
当同一个样式出现在了tailwind的类名和自定义类名时，tailwind会根据类名的顺序决定优先级，更前面的会覆盖后面的类名的相同样式。
prefix

# 原理
怎么知道js、html的className的？
postcss会将css代码转换为AST（抽象语法树），遍历进行增删改查。
extractor（提取器），通过正则匹配文本的class，添加到AST中生成代码。

postcss的工作流程：
它将 CSS 解析为抽象语法树 (AST)；将该 AST 传递给任意数量的“插件”函数；然后将该 AST 转换回字符串，您可以将其输出到文件中。AST 传递的每个函数可能会也可能不会对其进行转换；如果配置了源映射将生成源映射来跟踪任何更改。

