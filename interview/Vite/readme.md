# bundless

rollup
vite

# 代码压缩 esbuild 和 terser

1. esbuild 压缩率高，但是速度慢
2. terser 压缩率低，但是速度快，适合开发环境。

# 代码分割

注意：manualChunks 会在每个模块解析时频繁调用，尽量简化逻辑，比如 通过字符串匹配，不要使用正则。
通过 rollupOptions.output.manualChunks 的 id 进行更加精确的代码分割。

```
build:{
    rollupOptions:{
        output:{
            manualChunks(id) {
             //id代表文件的绝对路径：/Users/your-project/src/components/Button.vue
                if (id.includes('node_modules')) {
                    return id.toString().split('node_modules/')[1].split('/')[0].toString();
                }
            }

        }
    }
}
//基本分割
manualChunks: {
    vue: ['vue', 'vue-router'],
}
```

## 分割时做的优化项

1. 哈希文件命名

```
build: {
  rollupOptions: {
    output: {
      chunkFileNames: 'assets/[name]-[hash].js', // 分块文件命名规则
      assetFileNames: 'assets/[name]-[hash][extname]', // 静态资源命名
    },
  },
}
```

2. 分割文件大小限制

```
build: {
  chunkSizeWarningLimit: 1000, // 分块大小警告阈值（KB）
}
```
