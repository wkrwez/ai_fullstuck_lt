# 项目亮点和难点
- 可以安排和设计的
   - gpt AGI的时代
   AIGC 生成式的人工智能   openAI   chatgpt 应用形势 chatbot
   文本生成 文本生成图片（stablediffusion） 文本生成视频（sora）
   AGI   通用人工智能   机器人

   智能驾驶
   终局思维 技术变革已来   LLM   加速了学习速度和能力 什么都能做，团队里想通过未来3年的努力，能为一名优秀的开发工程师，陪团队一起拥抱AI红利。

   - 技术栈    讲一下   dependencies
      打好文稿，练了几次的 1000字
      - vue/vue-router/pinia 全家桶
         陈述过程，必需 （没有亮点就是亮点）
      - typescript
      - 学习一下，dependences 有点尝试的依赖包
         - markdown-it  解析  markdown 为 html
         - crypto-js 安全性  加密
         - tailwindcss
            - 原子化
            - css 工程化   开发依赖 配置  生成css文件
            - 适配，直接是rem
            - 自定义
         
## 项目亮点
   - 使用了路由懒加载
      - 首页加载速度 性能关键点  ()=>import()
      - Suspense  优化异步加载组件体验 比如显示loading...
         - slot
            默认 具名...
      - 路由守卫
         transition  页面动画
      - 骨架屏

   - 代码的封装写的挺好的
      - 干净漂亮的分离一些函数   一个函数只做一个功能（好代码）
      举例
         - getAPIKey()  开源项目可以免费获取api-key
         - clearMessageContent
         - switchConfigStatus

- 难点
   - 使用了cryptoJS 加密用户openai api-key   更安全
      - 引入了crypto-js
      - .AES.encrypt(原字符串，签名)
      - .AES.decrypt()

- 功能点介绍
   - chatbot 模块
      - 与OpenAI LLM 进行生成式问答功能
      - 使用了crypto-js 对用户的api-key进行加密
      - 根据功能点，函数封装的很细，便于复用和维护
        getApiKey saveApiKey getSecretKey clearMessageContent
        switchConfigStatus sendOrSave
