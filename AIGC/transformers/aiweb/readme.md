# AI + 前端如何结合
图像识别    nlp任务？
- transformers
    pipeline
    前端和图片？前端优势：展示，可视化，交互

## AI 前端应用体验

- coze  bot 应用图标生成
    - 以前我们需要设计师设计好图标后，我们上传
    - 设计师被KO 了，LLM 的AIGC帮助我们生成
        - 前端通过弹窗组件 收集名字+描述 文本内容
        - 通过ajax传递给LLM 生成图片（AIGC） 省人工（效率）
            - LLM需要一些时间，loading效果很nice
        - 基于LLM的AI前面，人人平等，我们可以完成AIGC任务
        - 生成的图片存在服务器端 static 静态服务器
        - 前端拿到url显示，完成
    - 图片上传体验
        input type=file 可定制不高，display:none,再label for 触发

    - 本地预览，优化文件图片上传
        - 传统需要先上传到服务器，得到src才能显示出来，但是这样太慢了
        - html5 File(e.target.files,访问文件系统)
            FileReader 将文件读取到内存中...
            DOM     img     

- 前端 + AI结合
    - ajax + LLM api 调用coze
    - transformer.js 浏览器端
    - 浏览器加载大模型
    - await 调用
    - 返回结果