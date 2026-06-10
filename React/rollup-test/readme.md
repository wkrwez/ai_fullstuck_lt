# style-loader

随着js运行时动态将css插入到head的style标签中，导致页面闪烁。
js代码体积增大。
css和js打包一起，无法单独缓存

# MiniCssExtractPlugin

把内联到js中的css代码提取到单独的文件。
好处：

1. 让css可以通过link标签并行加载
2. 支持代码分割
3. 减小js包体积

# rollup

## transform

在rollup读取文件内容后

- 多个插件的 transform 钩子会按顺序执行

## generateBundle

输出阶段钩子，用于在打包产物生成之前/之时，自定义添加、修改或操作最终的bundle内容

1. 解析阶段 (resolveId / load)
   ↓
2. 转换阶段 (transform) ← 你的 CSS 收集逻辑在这里
   ↓
3. 模块依赖图构建完成
   ↓
4. 代码分割 & Tree Shaking
   ↓
5. 【generateBundle】← 在这里！bundle 对象已准备好，但还没写入磁盘
   ↓
6. 写入输出目录 (writeBundle)
   精确时机：所有模块已转换、chunk 已生成，Rollup 即将把产物写入 output.dir 或 output.file 之前。
